/**
 * rateLimiter.js
 * ─────────────────────────────────────────────────────────────
 * Per-user rate limiting — compatible with express-rate-limit v8+
 *
 * v8 strict rule: when `trust proxy` is set, keyGenerator MUST NOT
 * return a raw IPv6 address (throws ERR_ERL_KEY_GEN_IPV6).
 * Fix: normalise the key — strip IPv6-mapped IPv4 (`::ffff:x.x.x.x`)
 * down to plain IPv4, and prefix non-IP keys so they are never
 * mistaken for addresses.
 *
 * Key priority (per request):
 *   1. req.body.rollNo / req.body.username  — stable user identity
 *   2. x-forwarded-for (first entry)        — real IP behind Vercel proxy
 *   3. req.socket.remoteAddress             — raw socket IP
 *
 * Tiers:
 *   globalLimiter   — all /api/* routes   : 100 req / 15 min
 *   loginLimiter    — POST /api/login     :  10 req / 15 min
 *   feedbackLimiter — POST /api/feedback  :   5 req / 15 min
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

const rateLimit = require('express-rate-limit');

// ── IP normalisation ──────────────────────────────────────────
/**
 * Strip the `::ffff:` IPv6-mapped-IPv4 prefix so we always work
 * with plain IPv4 strings.  Pure IPv6 addresses are left as-is
 * because express-rate-limit v8 only rejects them when they come
 * from the keyGenerator — we avoid that by prefixing with "ip:".
 */
function normaliseIp(raw) {
    if (!raw) return 'unknown';
    // ::ffff:1.2.3.4  →  1.2.3.4
    const stripped = raw.replace(/^::ffff:/i, '');
    return stripped;
}

// ── Key generator ─────────────────────────────────────────────
/**
 * Returns a string key that:
 *  - Preferably identifies the *authenticated user* (roll/username)
 *  - Falls back to the real client IP (normalised to IPv4 where possible)
 *  - Prefixes IP keys with "ip:" so they are never ambiguous
 *
 * The returned string is never a bare IPv6 address, so v8's
 * ERR_ERL_KEY_GEN_IPV6 validation passes cleanly.
 */
function getUserKey(req) {
    // 1. Body-based user identity (login + feedback endpoints)
    const bodyId = req.body?.rollNo || req.body?.username;
    if (bodyId) {
        return `user:${String(bodyId).toLowerCase().trim()}`;
    }

    // 2. Real IP from proxy header (Vercel sets x-forwarded-for)
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        const firstIp = forwarded.split(',')[0].trim();
        return `ip:${normaliseIp(firstIp)}`;
    }

    // 3. Raw socket address (local dev / direct connections)
    const socketIp = req.socket?.remoteAddress || 'unknown';
    return `ip:${normaliseIp(socketIp)}`;
}

// ── Shared handler ────────────────────────────────────────────
/**
 * Called when a user exceeds their limit.
 * Returns a structured JSON body + standard RateLimit headers.
 */
function onLimitReached(req, res, options) {
    const retryAfterSec = Math.ceil(options.windowMs / 1000);
    const key = getUserKey(req);

    console.warn(
        `[RATE LIMIT] Key="${key}" exceeded ${options.max} req on ` +
        `${req.method} ${req.path} | window=${options.windowMs / 1000}s`
    );

    res.status(429).json({
        error: 'Too Many Requests',
        message: options.message,
        retryAfter: retryAfterSec,       // seconds until window resets
        retryAfterMs: options.windowMs,   // ms — for programmatic use
        limit: options.max,
        path: req.path,
        timestamp: new Date().toISOString(),
    });
}

// ── Limiters ──────────────────────────────────────────────────

/**
 * GLOBAL — blanket ceiling across every /api/* route.
 * 100 requests per 15-minute window, per user key.
 */
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: getUserKey,
    standardHeaders: 'draft-7',  // RateLimit-* headers (RFC 9110 draft)
    legacyHeaders: false,
    message: 'You have sent too many requests. Please wait 15 minutes before trying again.',
    handler: onLimitReached,
    skip: (req) => req.method === 'OPTIONS',  // never throttle preflight
});

/**
 * LOGIN — brute-force guard on POST /api/login.
 * 10 attempts per 15-minute window, per user key.
 * If User A exceeds this → only User A is blocked.
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    keyGenerator: getUserKey,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many login attempts. Please wait 15 minutes before trying again.',
    handler: onLimitReached,
});

/**
 * FEEDBACK — spam guard on POST /api/feedback.
 * 5 submissions per 15-minute window, per user key.
 */
const feedbackLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyGenerator: getUserKey,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many feedback submissions. Please wait 15 minutes before trying again.',
    handler: onLimitReached,
});

module.exports = { globalLimiter, loginLimiter, feedbackLimiter };

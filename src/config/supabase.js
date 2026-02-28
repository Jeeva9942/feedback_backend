require('dotenv').config();
const dns = require('dns');
const https = require('https');

// Force IPv4 ordering to bypass common IPv6 timeouts in certain ISPs/Hotspots
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

/**
 * Robust fetch wrapper that adds timeouts and detailed logging
 * This helps bypass network timeouts on weak or restricted hotspots.
 */
const customFetch = async (url, options) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            // Keep-alive is handled automatically by Node.js global fetch (undici) pool
        });
        clearTimeout(timeoutId);
        return response;
    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
            console.error(`[NETWORK] Supabase timeout on: ${url}`);
        } else {
            console.error(`[NETWORK ERROR] Could not reach Supabase via ${url}. Reason: ${err.message}`);
            console.error(`--- TROUBLESHOOTING ---`);
            console.error(`1. Check "Network Restrictions" in Supabase: Settings -> Database -> Allow all IPs.`);
            console.error(`2. Ensure your hotspot isn't blocking Port 443 (HTTPS).`);
            console.error(`3. If "TypeError: fetch failed" persist, restart the server after switching networks.`);
        }
        throw err;
    }
};

const clientOptions = {
    global: { fetch: customFetch },
    auth: { persistSession: false }
};

// Use the standard anon/publishable key for the generic client
const supabase = createClient(supabaseUrl, supabaseKey, clientOptions);

// Use the service role secret key for admin privileges (bypassing RLS if needed)
const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY, clientOptions);

/**
 * Connectivity test on start-up
 */
async function testConnectionOnStartup() {
    try {
        console.log(`[CONN TEST] Verifying Supabase at ${supabaseUrl}...`);
        const { data, error } = await supabaseAdmin.from('all_students').select('count', { count: 'exact', head: true });
        if (error) {
            console.error(`[CONN TEST FAILED] Database responded with error: ${error.message}`);
        } else {
            console.log(`[CONN TEST OK] Successfully reached Supabase. Table "all_students" is accessible.`);
        }
    } catch (err) {
        console.error(`[CONN TEST CRITICAL ERROR] ${err.message}`);
    }
}

testConnectionOnStartup();

module.exports = { supabase, supabaseAdmin };

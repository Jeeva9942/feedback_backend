const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const feedbackController = require('../controllers/feedbackController');
const studentController = require('../controllers/studentController');
const { loginLimiter, feedbackLimiter } = require('../middleware/rateLimiter');

// ── Auth ─────────────────────────────────────────────────────
// loginLimiter: 10 attempts / 15 min per user — brute-force guard
router.post('/login', loginLimiter, authController.login);

// ── Students ─────────────────────────────────────────────────
router.get('/students', studentController.getAllStudents);

// ── Feedback ─────────────────────────────────────────────────
// feedbackLimiter: 5 submissions / 15 min per user — spam guard
router.post('/feedback', feedbackLimiter, feedbackController.submitFeedback);
router.get('/feedback/:department', feedbackController.getFeedbackByDepartment);
router.get('/stats', feedbackController.getDashboardStats);

module.exports = router;


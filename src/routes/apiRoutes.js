const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const feedbackController = require('../controllers/feedbackController');
const studentController = require('../controllers/studentController');

// Standard API Routes mapping to Controllers

// Auth
router.post('/login', authController.login);

// Students
router.get('/students', studentController.getAllStudents);

// Feedback
router.post('/feedback', feedbackController.submitFeedback);
router.get('/feedback/:department', feedbackController.getFeedbackByDepartment);
router.get('/stats', feedbackController.getDashboardStats);

module.exports = router;

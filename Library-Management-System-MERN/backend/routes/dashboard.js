const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// Protected routes (require authentication)
router.use(protect);

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', dashboardController.getDashboardStats);

// @route   GET /api/dashboard/activity
// @desc    Get recent activity
// @access  Private
router.get('/activity', dashboardController.getRecentActivity);

module.exports = router;

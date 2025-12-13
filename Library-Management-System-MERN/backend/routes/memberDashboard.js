const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMemberDashboard } = require('../controllers/memberDashboardController');

router.route('/dashboard')
  .get(protect, getMemberDashboard);

module.exports = router;

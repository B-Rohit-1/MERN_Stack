const express = require('express');
const router = express.Router();
const { 
  getFines, 
  payFine, 
  waiveFine, 
  getMemberFines 
} = require('../controllers/fineController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getFines);
router.post('/:fineId/pay', protect, payFine);
router.post('/:fineId/waive', protect, admin, waiveFine);
router.get('/member/:memberId', protect, getMemberFines);

module.exports = router;
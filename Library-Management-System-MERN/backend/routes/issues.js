const express = require('express');
const router = express.Router();
const { 
  issueBook, 
  returnBook, 
  getMemberIssues, 
  getBookIssues 
} = require('../controllers/issueController');
const { protect } = require('../middleware/auth');

router.post('/issue', protect, issueBook);
router.put('/return/:issueId', protect, returnBook);
router.get('/member/:memberId', protect, getMemberIssues);
router.get('/book/:bookId', protect, getBookIssues);

module.exports = router;
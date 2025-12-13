const express = require('express');
const router = express.Router();
const { getMembers, getMember, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, getMembers)
  .post(protect, admin, createMember);

router.route('/:id')
  .get(protect, getMember)
  .put(protect, admin, updateMember)
  .delete(protect, admin, deleteMember);

module.exports = router;
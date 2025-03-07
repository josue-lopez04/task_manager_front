// File: backend/routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const {
  createGroup,
  getAllGroups,
  getGroup,
  updateGroup,
  addGroupMember,
  removeGroupMember,
  deleteGroup,
} = require('../controllers/groupController');
const { auth } = require('../middleware/authentication');

router.route('/').post(auth, createGroup).get(auth, getAllGroups);
router.route('/:id').get(auth, getGroup).patch(auth, updateGroup).delete(auth, deleteGroup);
router.route('/:id/members').post(auth, addGroupMember).delete(auth, removeGroupMember);

module.exports = router;
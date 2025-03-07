// File: backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUser, 
  updateUserRole,
  getCurrentUser
} = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/authentication');

// Routes
router.route('/').get(auth, getAllUsers);
router.route('/me').get(auth, getCurrentUser);
router.route('/:id').get(auth, getUser);
router.route('/:id/role').patch(auth, adminOnly, updateUserRole);

module.exports = router;
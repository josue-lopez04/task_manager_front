// File: backend/controllers/userController.js
const User = require('../models/User');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get single user
const getUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: userId }).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: `No user with id: ${userId}` });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId }).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const { role } = req.body;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }
    
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: `No user with id: ${userId}` });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUserRole,
  getCurrentUser
};
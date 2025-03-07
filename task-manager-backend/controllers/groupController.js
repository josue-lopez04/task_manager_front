// File: backend/controllers/groupController.js
const Group = require('../models/Group');
const Task = require('../models/Task');

// Create group
const createGroup = async (req, res) => {
  try {
    // Add user ID to request body
    req.body.createdBy = req.user.userId;
    req.body.members = [req.user.userId];
    
    const group = await Group.create(req.body);
    res.status(201).json({ group });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get all groups for current user
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.userId
    }).populate({
      path: 'createdBy',
      select: 'username email'
    }).populate({
      path: 'members',
      select: 'username email'
    });
    
    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get single group
const getGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const group = await Group.findOne({ _id: groupId }).populate({
      path: 'members',
      select: 'username email'
    });
    
    if (!group) {
      return res.status(404).json({ msg: `No group with id: ${groupId}` });
    }
    
    // Check if user is member of this group
    const isMember = group.members.some(member => 
      member._id.toString() === req.user.userId
    );
    
    if (!isMember) {
      return res.status(403).json({ msg: 'Not authorized to access this group' });
    }
    
    // Get tasks for this group
    const tasks = await Task.find({ group: groupId }).populate({
      path: 'assignedTo',
      select: 'username email'
    });
    
    res.status(200).json({ group, tasks });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update group
const updateGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const group = await Group.findOne({ _id: groupId });
    
    if (!group) {
      return res.status(404).json({ msg: `No group with id: ${groupId}` });
    }
    
    // Check if user is creator of this group
    const isCreator = group.createdBy.toString() === req.user.userId;
    
    if (!isCreator) {
      return res.status(403).json({ msg: 'Not authorized to update this group' });
    }
    
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: groupId },
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ group: updatedGroup });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Add member to group
const addGroupMember = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { memberId } = req.body;
    
    const group = await Group.findOne({ _id: groupId });
    
    if (!group) {
      return res.status(404).json({ msg: `No group with id: ${groupId}` });
    }
    
    // Check if user is creator of this group
    const isCreator = group.createdBy.toString() === req.user.userId;
    
    if (!isCreator) {
      return res.status(403).json({ msg: 'Not authorized to add members to this group' });
    }
    
    // Check if member is already in the group
    if (group.members.includes(memberId)) {
      return res.status(400).json({ msg: 'User is already a member of this group' });
    }
    
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: groupId },
      { $push: { members: memberId } },
      { new: true, runValidators: true }
    ).populate({
      path: 'members',
      select: 'username email'
    });
    
    res.status(200).json({ group: updatedGroup });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Remove member from group
const removeGroupMember = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { memberId } = req.body;
    
    const group = await Group.findOne({ _id: groupId });
    
    if (!group) {
      return res.status(404).json({ msg: `No group with id: ${groupId}` });
    }
    
    // Check if user is creator of this group
    const isCreator = group.createdBy.toString() === req.user.userId;
    
    if (!isCreator) {
      return res.status(403).json({ msg: 'Not authorized to remove members from this group' });
    }
    
    // Check if trying to remove creator
    if (memberId === group.createdBy.toString()) {
      return res.status(400).json({ msg: 'Cannot remove the creator from the group' });
    }
    
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: groupId },
      { $pull: { members: memberId } },
      { new: true, runValidators: true }
    ).populate({
      path: 'members',
      select: 'username email'
    });
    
    res.status(200).json({ group: updatedGroup });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete group
const deleteGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const group = await Group.findOne({ _id: groupId });
    
    if (!group) {
      return res.status(404).json({ msg: `No group with id: ${groupId}` });
    }
    
    // Check if user is creator of this group
    const isCreator = group.createdBy.toString() === req.user.userId;
    
    if (!isCreator) {
      return res.status(403).json({ msg: 'Not authorized to delete this group' });
    }
    
    // Delete all tasks associated with this group
    await Task.deleteMany({ group: groupId });
    
    // Delete the group
    await Group.findOneAndDelete({ _id: groupId });
    
    res.status(200).json({ msg: 'Group and associated tasks removed' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroup,
  updateGroup,
  addGroupMember,
  removeGroupMember,
  deleteGroup,
};
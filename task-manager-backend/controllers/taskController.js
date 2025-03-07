// File: backend/controllers/taskController.js
const Task = require('../models/Task');

// Create task
const createTask = async (req, res) => {
  try {
    // Add user ID to request body
    req.body.createdBy = req.user.userId;
    
    const task = await Task.create(req.body);
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get all tasks for current user
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user.userId },
        { assignedTo: req.user.userId }
      ]
    }).populate({
      path: 'assignedTo',
      select: 'username email'
    }).populate({
      path: 'group',
      select: 'name'
    });
    
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get single task
const getTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const task = await Task.findOne({ _id: taskId });
    
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskId}` });
    }
    
    // Check if user has access to this task
    const isCreator = task.createdBy.toString() === req.user.userId;
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.userId;
    
    if (!isCreator && !isAssigned) {
      return res.status(403).json({ msg: 'Not authorized to access this task' });
    }
    
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const task = await Task.findOne({ _id: taskId });
    
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskId}` });
    }
    
    // Check authorization
    const isCreator = task.createdBy.toString() === req.user.userId;
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.userId;
    
    if (!isCreator && !isAssigned) {
      return res.status(403).json({ msg: 'Not authorized to update this task' });
    }
    
    // If user is assigned but not creator, they can only update status
    if (isAssigned && !isCreator) {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ msg: 'Only status can be updated' });
      }
      
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId },
        { status },
        { new: true, runValidators: true }
      );
      
      return res.status(200).json({ task: updatedTask });
    }
    
    // Creator can update anything
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ task: updatedTask });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const task = await Task.findOne({ _id: taskId });
    
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskId}` });
    }
    
    // Only creator can delete
    if (task.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Not authorized to delete this task' });
    }
    
    await Task.findOneAndDelete({ _id: taskId });
    res.status(200).json({ msg: 'Task removed' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
};
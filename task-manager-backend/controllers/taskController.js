const Task = require('../models/Task');
const User = require('../models/User'); // Asegúrate de importar el modelo User
const Group = require('../models/Group'); // Asegúrate de importar el modelo Group

// Create task
const createTask = async (req, res) => {
  try {
    console.log("User creating task:", req.user);
    // Add user ID to request body
    req.body.createdBy = req.user.userId;
    
    const task = await Task.create(req.body);
    console.log("Created task:", task);
    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
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
    })
    .populate({
      path: 'assignedTo',
      select: 'username email'
    })
    .populate({
      path: 'createdBy',
      select: 'username email'
    })
    .populate({
      path: 'group',
      select: 'name'
    });
    
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ msg: error.message });
  }
};

// Get single task
const getTask = async (req, res) => {
  try {
    console.log('User requesting task:', req.user); // Información de depuración
    console.log('Task ID:', req.params.id);
    
    const { id: taskId } = req.params;
    
    if (!taskId) {
      return res.status(400).json({ msg: 'Task ID is required' });
    }
    
    const task = await Task.findOne({ _id: taskId })
      .populate({
        path: 'assignedTo',
        select: 'username email'
      })
      .populate({
        path: 'createdBy',
        select: 'username email'
      })
      .populate({
        path: 'group',
        select: 'name'
      });
    
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskId}` });
    }
    
    // Verificar si el usuario tiene acceso a esta tarea
    const isCreator = task.createdBy && task.createdBy._id.toString() === req.user.userId;
    const isAssigned = task.assignedTo && task.assignedTo._id.toString() === req.user.userId;
    
    // Si es una tarea personal, solo el creador puede verla
    // Si es una tarea de grupo, el creador o la persona asignada pueden verla
    const isPersonalTask = !task.group;
    const hasAccess = isPersonalTask ? isCreator : (isCreator || isAssigned);
    
    if (!hasAccess) {
      return res.status(403).json({ msg: 'Not authorized to access this task' });
    }
    
    res.status(200).json({ task });
  } catch (error) {
    console.error('Error getting task:', error);
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
    
    // Si no es creador ni está asignado, no tiene permisos
    if (!isCreator && !isAssigned) {
      return res.status(403).json({ msg: 'Not authorized to update this task' });
    }
    
    // Si está asignado pero no es creador, solo puede actualizar el estado
    if (isAssigned && !isCreator) {
      const { status } = req.body;
      
      if (Object.keys(req.body).length > 1 || !status) {
        return res.status(403).json({ msg: 'You can only update the status of this task' });
      }
      
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId },
        { status },
        { new: true, runValidators: true }
      ).populate({
        path: 'assignedTo',
        select: 'username email'
      }).populate({
        path: 'createdBy',
        select: 'username email'
      }).populate({
        path: 'group',
        select: 'name'
      });
      
      return res.status(200).json({ task: updatedTask });
    }
    
    // Si es creador, puede actualizar todo
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: 'assignedTo',
      select: 'username email'
    }).populate({
      path: 'createdBy',
      select: 'username email'
    }).populate({
      path: 'group',
      select: 'name'
    });
    
    res.status(200).json({ task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
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
    const isCreator = task.createdBy.toString() === req.user.userId;
    if (!isCreator) {
      return res.status(403).json({ msg: 'Not authorized to delete this task' });
    }
    
    await Task.findOneAndDelete({ _id: taskId });
    res.status(200).json({ msg: 'Task removed' });
  } catch (error) {
    console.error('Delete task error:', error);
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

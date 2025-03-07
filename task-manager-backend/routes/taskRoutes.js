// File: backend/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { auth } = require('../middleware/authentication');

router.route('/').post(auth, createTask).get(auth, getAllTasks);
router.route('/:id').get(auth, getTask).patch(auth, updateTask).delete(auth, deleteTask);

module.exports = router;
// File: src/context/TaskContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tasks for the current user
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single task
  const getTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/tasks/${taskId}`);
      return response.data.task;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch task');
      console.error('Error fetching task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/tasks`, taskData);
      setTasks([...tasks, response.data.task]);
      return response.data.task;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a task
  const updateTask = async (taskId, taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`${API_URL}/tasks/${taskId}`, taskData);
      
      // Update task in local state
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data.task : task
      ));
      
      return response.data.task;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      
      // Remove task from local state
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
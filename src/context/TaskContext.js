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
      if (response.data && response.data.tasks) {
        setTasks(response.data.tasks);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.msg || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single task
  const getTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching task with ID: ${taskId}`);
      const response = await axios.get(`${API_URL}/tasks/${taskId}`);
      console.log("Task API Response:", response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return response.data;
    } catch (err) {
      console.error('Error fetching task:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
      }
      setError(err.response?.data?.msg || 'Failed to fetch task');
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
      if (response.data && response.data.task) {
        setTasks([...tasks, response.data.task]);
        return response.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.msg || 'Failed to create task');
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
      
      if (response.data && response.data.task) {
        // Update task in local state
        setTasks(tasks.map(task => 
          task._id === taskId ? response.data.task : task
        ));
        
        return response.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.msg || 'Failed to update task');
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
      const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
      
      // Remove task from local state
      setTasks(tasks.filter(task => task._id !== taskId));
      
      return response.data;
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.response?.data?.msg || 'Failed to delete task');
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
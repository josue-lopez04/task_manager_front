// src/services/taskService.js
import api from './api';

// Función auxiliar para registrar las llamadas API
const logApiCall = (method, url, data) => {
  console.log(`[API ${method}] ${url}`, data || '');
};

// Función auxiliar para registrar las respuestas API
const logApiResponse = (method, url, response) => {
  console.log(`[API ${method} Response] ${url}:`, 
    response ? 
      (typeof response === 'object' ? 
        `Status: ${response.status}, Data: ${JSON.stringify(response.data)}` : 
        response) : 
      'No response');
};

// Función auxiliar para registrar errores API
const logApiError = (method, url, error) => {
  console.error(`[API ${method} Error] ${url}:`, 
    error ? 
      (error.response ? 
        `Status: ${error.response.status}, Message: ${error.message}, Data: ${JSON.stringify(error.response.data)}` : 
        error.message) : 
      'Unknown error');
};

export const taskService = {
  // Get all tasks for current user
  getAllTasks: async () => {
    const url = '/tasks';
    logApiCall('GET', url);
    
    try {
      const response = await api.get(url);
      logApiResponse('GET', url, response);
      return response.data.tasks;
    } catch (error) {
      logApiError('GET', url, error);
      throw error;
    }
  },

  // Get a specific task
  getTask: async (taskId) => {
    const url = `/tasks/${taskId}`;
    logApiCall('GET', url);
    
    try {
      const response = await api.get(url);
      logApiResponse('GET', url, response);
      
      // Analizar la estructura de la respuesta
      if (response.data) {
        console.log('[taskService] Response data structure:', Object.keys(response.data));
        if (response.data.task) {
          console.log('[taskService] Task found in response.data.task');
        } else {
          console.log('[taskService] No task property in response.data');
        }
      }
      
      return response.data;
    } catch (error) {
      logApiError('GET', url, error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    const url = '/tasks';
    logApiCall('POST', url, taskData);
    
    try {
      const response = await api.post(url, taskData);
      logApiResponse('POST', url, response);
      return response.data.task;
    } catch (error) {
      logApiError('POST', url, error);
      throw error;
    }
  },

  // Update an existing task
  updateTask: async (taskId, taskData) => {
    const url = `/tasks/${taskId}`;
    logApiCall('PATCH', url, taskData);
    
    try {
      const response = await api.patch(url, taskData);
      logApiResponse('PATCH', url, response);
      return response.data.task;
    } catch (error) {
      logApiError('PATCH', url, error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    const url = `/tasks/${taskId}`;
    logApiCall('DELETE', url);
    
    try {
      const response = await api.delete(url);
      logApiResponse('DELETE', url, response);
      return response.data;
    } catch (error) {
      logApiError('DELETE', url, error);
      throw error;
    }
  }
};
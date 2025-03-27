// src/context/TaskContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { taskService } from '../services/taskService';

// Crear el contexto
const TaskContext = createContext();

// Hook personalizado para usar el contexto
export const useTaskContext = () => useContext(TaskContext);

// Proveedor del contexto
export const TaskProvider = ({ children }) => {
  // Estado para la lista de tareas
  const [tasks, setTasks] = useState([]);
  // Estado para operaciones globales (como fetchTasks)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las tareas del usuario actual
  const fetchTasks = useCallback(async () => {
    try {
      console.log('[TaskContext] Fetching all tasks');
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getAllTasks();
      console.log('[TaskContext] Tasks fetched:', tasksData?.length || 0);
      setTasks(tasksData || []);
    } catch (err) {
      console.error('[TaskContext] Error fetching tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // IMPORTANTE: getTask no modifica el estado global del contexto
  // para evitar interferencias entre componentes
  const getTask = async (taskId) => {
    console.log(`[TaskContext] Getting task: ${taskId}`);
    try {
      // No modificamos el estado loading/error del contexto
      const response = await taskService.getTask(taskId);
      console.log('[TaskContext] Task retrieved:', response ? 'yes' : 'no');
      return response;
    } catch (err) {
      console.error('[TaskContext] Error getting task:', err);
      // No actualizamos el estado de error global
      throw err;
    }
  };

  // Crear una nueva tarea
  const createTask = async (taskData) => {
    try {
      console.log('[TaskContext] Creating task');
      setLoading(true);
      setError(null);
      const newTask = await taskService.createTask(taskData);
      console.log('[TaskContext] Task created:', newTask?._id);
      
      // Actualizar la lista de tareas solo si la tarea fue creada correctamente
      if (newTask) {
        setTasks(prev => [...prev, newTask]);
      }
      
      return newTask;
    } catch (err) {
      console.error('[TaskContext] Error creating task:', err);
      setError(err.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una tarea existente
  const updateTask = async (taskId, taskData) => {
    try {
      console.log(`[TaskContext] Updating task: ${taskId}`);
      setLoading(true);
      setError(null);
      const updatedTask = await taskService.updateTask(taskId, taskData);
      console.log('[TaskContext] Task updated:', updatedTask?._id);
      
      // Actualizar la lista de tareas solo si la tarea fue actualizada correctamente
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task._id === taskId ? updatedTask : task
        ));
      }
      
      return updatedTask;
    } catch (err) {
      console.error('[TaskContext] Error updating task:', err);
      setError(err.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una tarea
  const deleteTask = async (taskId) => {
    try {
      console.log(`[TaskContext] Deleting task: ${taskId}`);
      setLoading(true);
      setError(null);
      await taskService.deleteTask(taskId);
      console.log('[TaskContext] Task deleted');
      
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('[TaskContext] Error deleting task:', err);
      setError(err.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Valor del contexto
  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    clearError
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('todo');
  const [statusLoading, setStatusLoading] = useState(false);
  const [creatorName, setCreatorName] = useState('');

  // Función para obtener la tarea directamente con axios
  const fetchTask = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tasks/${taskId}`);
      
      if (response.data && response.data.task) {
        const taskData = response.data.task;
        setTask(taskData);
        setStatus(taskData.status || 'todo');
        
        // Manejar el nombre del creador
        if (taskData.createdBy) {
          if (typeof taskData.createdBy === 'object' && taskData.createdBy.username) {
            setCreatorName(taskData.createdBy.username);
          } else if (typeof taskData.createdBy === 'string') {
            try {
              const userResponse = await axios.get(`${API_URL}/users/${taskData.createdBy}`);
              if (userResponse.data && userResponse.data.user) {
                setCreatorName(userResponse.data.user.username);
              }
            } catch (userErr) {
              console.error('Error fetching creator:', userErr);
            }
          }
        }
      } else {
        throw new Error('Failed to load task data');
      }
    } catch (err) {
      console.error('Error fetching task:', err);
      setError(err.response?.data?.msg || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para actualizar el estado de la tarea
  const updateTaskStatus = async (newStatus) => {
    setStatusLoading(true);
    try {
      const response = await axios.patch(`${API_URL}/tasks/${taskId}`, { 
        status: newStatus 
      });
      
      if (response.data && response.data.task) {
        setTask(response.data.task);
        console.log('Task status updated successfully');
      } else {
        throw new Error('Failed to update task');
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      setError(err.response?.data?.msg || 'Failed to update task status');
      setStatus(task?.status || 'todo'); // Revert to previous status
    } finally {
      setStatusLoading(false);
    }
  };
  
  // Función para eliminar la tarea
  const deleteTask = async () => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete task');
    }
  };

  // Efecto para cargar la tarea una sola vez
  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]); 

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask();
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateTaskStatus(newStatus);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-500">Loading task...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Error: {error}</p>
        <Link to="/tasks" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to tasks
        </Link>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-600">Task not found</p>
        <Link to="/tasks" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <div className="flex space-x-2">
          <Link
            to={`/tasks/${taskId}/edit`}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 p-3 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="mt-1">{task.description || 'No description provided'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Priority</p>
              <p className="mt-1 capitalize">{task.priority || 'Medium'}</p>
            </div>

            {task.dueDate && (
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="mt-1">
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {task.group && (
              <div>
                <p className="text-sm text-gray-500">Group</p>
                <Link
                  to={`/groups/${task.group._id}`}
                  className="mt-1 text-blue-600 hover:underline inline-block"
                >
                  {task.group.name || 'Unknown Group'}
                </Link>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Status</h3>
          <div className="space-y-4">
            {/* Selector de estatus siempre disponible */}
            <div>
              <label htmlFor="status" className="block text-sm text-gray-500">
                Current Status
              </label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={handleStatusChange}
                disabled={statusLoading}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="todo">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
              {statusLoading && (
                <p className="text-xs text-gray-500 mt-1">Updating status...</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Created By</p>
              <p className="mt-1">{creatorName || task.createdBy?.username || 'Unknown'}</p>
            </div>

            {task.assignedTo && (
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                <p className="mt-1">{task.assignedTo.username || 'Unknown'}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="mt-1">
                {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/tasks" className="text-blue-600 hover:underline">
          Back to tasks
        </Link>
      </div>
    </div>
  );
};

export default TaskDetailPage;
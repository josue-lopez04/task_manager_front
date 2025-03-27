import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
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
  const [permissionInfo, setPermissionInfo] = useState('');

  // Depuración del usuario actual
  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  // Función para obtener la tarea
  const fetchTask = async () => {
    setLoading(true);
    try {
      console.log('Fetching task with ID:', taskId);
      const response = await api.get(`/tasks/${taskId}`);
      console.log('Task API Response:', response.data);
      
      if (response.data && response.data.task) {
        const taskData = response.data.task;
        setTask(taskData);
        setStatus(taskData.status || 'todo');
        
        // Depuración de la tarea cargada
        console.log('Task loaded:', taskData);
        console.log('Created by:', taskData.createdBy);
        console.log('Assigned to:', taskData.assignedTo);
        console.log('Group:', taskData.group);
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
      console.log('Updating task status to:', newStatus);
      const response = await api.patch(`/tasks/${taskId}`, { 
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

  // Efecto para cargar la tarea una sola vez
  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]); 

  // Determinar permisos cada vez que la tarea cambia
  useEffect(() => {
    if (task && user) {
      let isCreator = false;
      let isAssigned = false;
      
      // Verificar si el usuario es el creador
      if (typeof task.createdBy === 'object' && task.createdBy._id) {
        isCreator = task.createdBy._id === user._id; // Usar _id en lugar de userId
        console.log('Creator check (object):', task.createdBy._id, user._id, isCreator);
      } else if (typeof task.createdBy === 'string') {
        isCreator = task.createdBy === user._id; // Usar _id en lugar de userId
        console.log('Creator check (string):', task.createdBy, user._id, isCreator);
      }
      
      // Y lo mismo para la verificación de asignado
      if (typeof task.assignedTo === 'object' && task.assignedTo._id) {
        isAssigned = task.assignedTo._id === user._id; // Usar _id en lugar de userId
        console.log('Assignee check (object):', task.assignedTo._id, user._id, isAssigned);
      } else if (typeof task.assignedTo === 'string') {
        isAssigned = task.assignedTo === user._id; // Usar _id en lugar de userId
        console.log('Assignee check (string):', task.assignedTo, user._id, isAssigned);
      }
      
      // Es una tarea de grupo si tiene la propiedad group
      const isGroupTask = !!task.group;
      console.log('Is group task:', isGroupTask);
      
      // Determinar si puede actualizar el estado
      const canUpdate = isCreator || (isGroupTask && isAssigned);
      
      // Mensaje informativo para depuración
      let infoMessage = '';
      if (canUpdate) {
        infoMessage = `You can update this task as the ${isCreator ? 'creator' : 'assignee'}.`;
      } else {
        infoMessage = 'You cannot update this task. ';
        if (!isCreator && !isAssigned) {
          infoMessage += 'You are neither the creator nor the assignee.';
        } else if (!isCreator && isAssigned && !isGroupTask) {
          infoMessage += 'You are assigned but this is not a group task.';
        }
      }
      
      setPermissionInfo(infoMessage);
      console.log('Permission info:', infoMessage);
    }
  }, [task, user]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateTaskStatus(newStatus);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white shadow-sm rounded-lg p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
        <p className="ml-3 text-gray-600 font-medium">Loading task...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
        <p className="text-red-600 font-medium mb-4">Error: {error}</p>
        <Link to="/tasks" className="bg-white text-blue-600 border border-blue-300 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors inline-block">
          Back to tasks
        </Link>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
        <p className="text-yellow-700 font-medium mb-4">Task not found</p>
        <Link to="/tasks" className="bg-white text-blue-600 border border-blue-300 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors inline-block">
          Back to tasks
        </Link>
      </div>
    );
  }

// Determinar permisos de forma correcta
// Verificar si el usuario es el creador
let isCreator = false;
if (task.createdBy) {
  if (typeof task.createdBy === 'object' && task.createdBy._id) {
    isCreator = task.createdBy._id === user?._id; // Usar _id en lugar de userId
  } else if (typeof task.createdBy === 'string') {
    isCreator = task.createdBy === user?._id; // Usar _id en lugar de userId
  }
}

// Verificar si el usuario está asignado
let isAssigned = false;
if (task.assignedTo) {
  if (typeof task.assignedTo === 'object' && task.assignedTo._id) {
    isAssigned = task.assignedTo._id === user?._id; // Usar _id en lugar de userId
  } else if (typeof task.assignedTo === 'string') {
    isAssigned = task.assignedTo === user?._id; // Usar _id en lugar de userId
  }
}
  
  // Es una tarea de grupo si tiene la propiedad group
  const isGroupTask = !!task.group;
  
  // Si es el creador siempre puede editar, o si es una tarea de grupo y está asignado
  const canUpdateStatus = isCreator || (isGroupTask && isAssigned);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium';
      case 'low':
        return 'text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
            <div className="mt-2">
              <span className={getPriorityClass(task.priority || 'medium')}>
                {task.priority || 'Medium'} Priority
              </span>
              {isGroupTask && (
                <span className="ml-2 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  Group Task
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            {isCreator && (
              <Link
                to={`/tasks/${taskId}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors"
              >
                Edit
              </Link>
            )}
            {isCreator && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    api.delete(`/tasks/${taskId}`).then(() => navigate('/tasks'));
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium shadow-sm transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 pb-2 border-b border-gray-200">Details</h3>
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Description</p>
                <div className="bg-white p-3 rounded-md border border-gray-100 min-h-[60px]">
                  <p className="text-gray-700">{task.description || 'No description provided'}</p>
                </div>
              </div>

              {task.dueDate && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Due Date</p>
                  <div className="bg-white p-3 rounded-md border border-gray-100">
                    <p className="text-gray-700">{new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {task.group && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Group</p>
                  <div className="bg-white p-3 rounded-md border border-gray-100">
                    <Link
                      to={`/groups/${task.group._id || task.group}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {task.group.name || 'Group Task'}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Información de permisos para depuración */}
            {permissionInfo && (
              <div className="mt-5 p-3 bg-blue-50 text-blue-800 text-xs rounded-md border border-blue-100">
                {permissionInfo}
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 pb-2 border-b border-gray-200">Status</h3>
            <div className="space-y-5">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">
                  Current Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={handleStatusChange}
                    disabled={statusLoading || !canUpdateStatus}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 ${!canUpdateStatus ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                  {status && (
                    <div className={`absolute right-2 top-2 w-3 h-3 rounded-full ${status === 'todo' ? 'bg-gray-400' : status === 'in progress' ? 'bg-blue-500' : status === 'review' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                  )}
                </div>
                
                {statusLoading && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                    Updating status...
                  </p>
                )}
                
                {!canUpdateStatus && (
                  <p className="text-xs text-red-500 mt-2">
                    {isGroupTask 
                      ? "Only the creator or assigned user can update this task's status."
                      : "Only the creator can update this task's status."}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Created By</p>
                  <div className="bg-white p-3 rounded-md border border-gray-100">
                    <p className="text-gray-700">
                      {typeof task.createdBy === 'object' && task.createdBy.username
                        ? task.createdBy.username
                        : 'Unknown'}
                    </p>
                  </div>
                </div>

                {task.assignedTo && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Assigned To</p>
                    <div className="bg-white p-3 rounded-md border border-gray-100">
                      <p className="text-gray-700">
                        {typeof task.assignedTo === 'object' && task.assignedTo.username
                          ? task.assignedTo.username 
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Created At</p>
                <div className="bg-white p-3 rounded-md border border-gray-100">
                  <p className="text-gray-700">
                    {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200">
                <div className="grid grid-cols-3 gap-2">
                  <div className="px-2 py-1 rounded bg-white">
                    <p className="font-medium">Task Type</p>
                    <p>{isGroupTask ? 'Group Task' : 'Personal Task'}</p>
                  </div>
                  <div className="px-2 py-1 rounded bg-white">
                    <p className="font-medium">Your Role</p>
                    <p>{isCreator ? 'Creator' : ''} {isAssigned ? 'Assignee' : ''}</p>
                  </div>
                  <div className="px-2 py-1 rounded bg-white">
                    <p className="font-medium">Can Update</p>
                    <p>{canUpdateStatus ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center">
          <Link to="/tasks" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Back to tasks
          </Link>
          
          <div className="text-xs text-gray-500">
            Last updated: {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
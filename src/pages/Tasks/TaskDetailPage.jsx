// File: src/pages/Tasks/TaskDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { getTask, deleteTask, updateTask } = useTaskContext();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const taskData = await getTask(taskId);
        setTask(taskData);
        setStatus(taskData.status);
      } catch (err) {
        setError(err.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, getTask]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        navigate('/tasks');
      } catch (err) {
        setError(err.message || 'Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setStatusLoading(true);
    
    try {
      const updatedTask = await updateTask(taskId, { status: newStatus });
      setTask(updatedTask);
    } catch (err) {
      setError(err.message || 'Failed to update task status');
      setStatus(task.status); // Revert to previous status
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading task...</p>
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

  const isCreator = task.createdBy === user?.userId;
  const isAssigned = task.assignedTo?._id === user?.userId;
  const canEdit = isCreator;
  const canUpdateStatus = isCreator || isAssigned;

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <div className="flex space-x-2">
          {canEdit && (
            <Link
              to={`/tasks/${taskId}/edit`}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Edit
            </Link>
          )}
          {isCreator && (
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          )}
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
              <p className="mt-1 capitalize">{task.priority}</p>
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
                  {task.group.name}
                </Link>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Status</h3>
          <div className="space-y-4">
            {canUpdateStatus ? (
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
            ) : (
              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <p className="mt-1 capitalize">{task.status}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Created By</p>
              <p className="mt-1">{task.createdBy?.username || 'Unknown'}</p>
            </div>

            {task.assignedTo && (
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                <p className="mt-1">{task.assignedTo.username}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="mt-1">
                {new Date(task.createdAt).toLocaleString()}
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
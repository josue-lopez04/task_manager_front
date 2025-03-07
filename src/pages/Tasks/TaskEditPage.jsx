// File: src/pages/Tasks/TaskEditPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../../context/TaskContext';
import TaskForm from '../../components/TaskForm';

const TaskEditPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { getTask } = useTaskContext();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const taskData = await getTask(taskId);
        setTask(taskData);
      } catch (err) {
        setError(err.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, getTask]);

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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Edit Task</h2>
        <p className="text-gray-600">
          Update task details
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        {task ? (
          <TaskForm task={task} />
        ) : (
          <p className="text-yellow-600">Task not found</p>
        )}
      </div>

      <div className="mt-4">
        <Link to={`/tasks/${taskId}`} className="text-blue-600 hover:underline">
          Back to task details
        </Link>
      </div>
    </div>
  );
};

export default TaskEditPage;
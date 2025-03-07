// File: src/pages/Tasks/TaskCreatePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import TaskForm from '../../components/TaskForm';

const TaskCreatePage = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Create New Task</h2>
        <p className="text-gray-600">
          Add a new task to your personal list
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <TaskForm />
      </div>

      <div className="mt-4">
        <Link to="/tasks" className="text-blue-600 hover:underline">
          Back to tasks
        </Link>
      </div>
    </div>
  );
};

export default TaskCreatePage;

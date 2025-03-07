// File: src/components/TaskCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Tasks.css';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TaskCard = ({ task }) => {
  const { _id, title, description, priority, dueDate, assignedTo } = task;
  
  return (
    <Link to={`/tasks/${_id}`} className="block">
      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
        <h4 className="font-semibold mb-2">{title}</h4>
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(priority)}`}>
            {priority}
          </span>
          {dueDate && (
            <span className="text-xs text-gray-500">
              Due: {new Date(dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        {assignedTo && (
          <div className="mt-2 text-xs text-gray-500">
            Assigned to: {assignedTo.username || 'Unknown'}
          </div>
        )}
      </div>
    </Link>
  );
};

export default TaskCard;




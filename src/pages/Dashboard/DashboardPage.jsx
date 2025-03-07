
// File: src/pages/Dashboard/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import TaskCard from '../../components/TaskCard';
import './DashboardPage.css'
const DashboardPage = () => {
  const { tasks, loading, error, fetchTasks } = useTaskContext();
  const [tasksByStatus, setTasksByStatus] = useState({
    todo: [],
    'in progress': [],
    review: [],
    done: [],
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (tasks.length > 0) {
      const grouped = tasks.reduce((acc, task) => {
        const status = task.status.toLowerCase();
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(task);
        return acc;
      }, {
        todo: [],
        'in progress': [],
        review: [],
        done: [],
      });
      
      setTasksByStatus(grouped);
    }
  }, [tasks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>My Dashboard</h2>
          <p>Welcome to your task dashboard. Here's an overview of your tasks by status.</p>
        </div>
    
        <div className="task-grid">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="task-column">
              <h3>{status} ({statusTasks.length})</h3>
              <div>
                {statusTasks.length > 0 ? (
                  statusTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))
                ) : (
                  <p>No tasks in this status</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    
};

export default DashboardPage;
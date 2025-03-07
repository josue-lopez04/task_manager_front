import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../../context/TaskContext';
import KanbanBoard from '../../components/KanbanBoard';
import './TaskPage.css';

const TasksPage = () => {
  const { tasks, loading, error, fetchTasks, updateTask } = useTaskContext();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskStatusUpdate = async (taskId, taskData) => {
    try {
      await updateTask(taskId, taskData);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2>My Tasks</h2>
        <Link to="/tasks/create">New Task</Link>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-tasks-container">
          <p>You don't have any tasks yet.</p>
          <Link to="/tasks/create">Create your first task</Link>
        </div>
      ) : (
        <div className="kanban-board-container">
          <KanbanBoard tasks={tasks} onTaskUpdate={handleTaskStatusUpdate} />
        </div>
      )}
    </div>
  );
};

export default TasksPage;


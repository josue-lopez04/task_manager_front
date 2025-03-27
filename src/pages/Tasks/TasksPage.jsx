import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../../context/TaskContext';
import KanbanBoard from '../../components/KanbanBoard';
import './TaskPage.css';

const TasksPage = () => {
  const { tasks: allTasks, loading, error, fetchTasks, updateTask } = useTaskContext();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (allTasks) {
      setTasks(allTasks);
    }
  }, [allTasks]);

  const handleTaskStatusUpdate = async (taskId, taskData) => {
    try {
      // Actualización optimista para que la UI responda inmediatamente
      const updatedTasks = tasks.map(task => {
        if (task._id === taskId) {
          return { ...task, ...taskData };
        }
        return task;
      });
      
      // Actualizar el estado local inmediatamente
      setTasks(updatedTasks);
      
      // Luego realizar la actualización en el servidor
      await updateTask(taskId, taskData);
      
      // No es necesario hacer otra actualización completa
      // ya que ya actualizamos optimistamente
    } catch (error) {
      console.error('Error updating task:', error);
      // En caso de error, revertir al estado original
      fetchTasks();
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2>My Tasks</h2>
        <Link to="/tasks/create">New Task</Link>
      </div>

      {loading && tasks.length === 0 ? (
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
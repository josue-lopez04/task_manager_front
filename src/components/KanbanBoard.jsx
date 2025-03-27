import React from 'react';
import { Link } from 'react-router-dom';
import './KanbanBoard.css'; // Asegúrate de tener este archivo CSS

const KanbanBoard = ({ tasks, onTaskUpdate }) => {
  // Función para obtener el color según la prioridad
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

  // Estados para el tablero Kanban
  const statuses = ["todo", "in progress", "review", "done"];
  
  // Función para manejar el cambio de estado
  const handleStatusChange = (taskId, newStatus) => {
    onTaskUpdate(taskId, { status: newStatus });
  };

  // Agrupar tareas por estado
  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {});

  return (
    <div className="kanban-board">
      {statuses.map(status => (
        <div key={status} className="kanban-column">
          <h3 className="kanban-column-title">
            {status === "in progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
          </h3>
          
          <div className="kanban-tasks">
            {tasksByStatus[status].length > 0 ? (
              tasksByStatus[status].map(task => (
                <div key={task._id} className="kanban-task">
                  <Link to={`/tasks/${task._id}`} className="kanban-task-title">
                    {task.title}
                  </Link>
                  
                  {task.description && (
                    <p className="kanban-task-description">{task.description}</p>
                  )}
                  
                  <div className="kanban-task-footer">
                    <span className={`kanban-task-priority ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    
                    {task.assignedTo && (
                      <span className="kanban-task-assigned">
                        {typeof task.assignedTo === 'object' ? task.assignedTo.username : 'Assigned'}
                      </span>
                    )}
                  </div>
                  
                  <div className="kanban-task-actions">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="kanban-task-select"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>
                          {s === "in progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="kanban-empty-column">
                <p>No tasks</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
// File: src/pages/Tasks/TaskEditPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../../context/TaskContext';
import TaskForm from '../../components/TaskForm';
import api from '../../services/api';

const TaskEditPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { getTask } = useTaskContext();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar un enfoque diferente para obtener la tarea - directamente desde la API
  useEffect(() => {
    let isMounted = true;
    
    const fetchTaskDirectly = async () => {
      if (!taskId) {
        if (isMounted) {
          setError('ID de tarea no proporcionado');
          setLoading(false);
        }
        return;
      }
      
      try {
        // Llamar directamente a la API en lugar de usar el contexto
        const response = await api.get(`/tasks/${taskId}`);
        
        if (isMounted) {
          if (response.data && response.data.task) {
            setTask(response.data.task);
          } else {
            setError('No se pudo cargar la tarea');
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error al cargar la tarea:', err);
          setError(err.message || 'Error al cargar la tarea');
          setLoading(false);
        }
      }
    };

    fetchTaskDirectly();
    
    return () => {
      isMounted = false;
    };
  }, [taskId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg shadow-sm">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-blue-600 text-xs font-semibold">TASK</span>
          </div>
        </div>
        <p className="text-gray-600 ml-4 font-medium">Cargando tarea...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200 transition-all">
        <div className="flex items-center mb-4">
          <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-700">Error</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <Link 
          to="/tasks" 
          className="inline-flex items-center px-4 py-2 bg-white border border-red-300 rounded-full text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a tareas
        </Link>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200 transition-all">
        <div className="flex items-center mb-4">
          <svg className="w-8 h-8 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-yellow-700">Tarea no encontrada</h3>
        </div>
        <p className="text-yellow-600 mb-4">No pudimos encontrar la tarea solicitada.</p>
        <Link 
          to="/tasks" 
          className="inline-flex items-center px-4 py-2 bg-white border border-yellow-300 rounded-full text-yellow-600 hover:bg-yellow-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a tareas
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm mb-8 border-l-4 border-blue-500">
        <h2 className="text-3xl font-bold text-blue-800">Editar Tarea</h2>
        <p className="text-blue-600 opacity-75 mt-2">
          Actualiza los detalles de la tarea "{task.title}"
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Formulario de Edición</h3>
          </div>
        </div>
        <div className="p-6">
          <TaskForm task={task} />
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <Link 
          to={`/tasks/${taskId}`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-2 h-2 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a detalles de la tarea
        </Link>
        <div className="text-xs text-gray-500">
          Última actualización: {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default TaskEditPage;
export const API_URL = "https://task-manager-backend-one-beryl.vercel.app/api";

// Información de la aplicación
export const APP_INFO = {
  name: 'Task Manager',
  version: '1.0.0',
  description: 'A collaborative task management application'
};

// Configuraciones de la UI
export const UI_CONFIG = {
  // Intervalos de polling para actualizaciones en tiempo real (en milisegundos)
  polling: {
    tasks: 3000,
    groups: 3000
  },
  
  // Tamaños de paginación para listas
  pagination: {
    tasksPerPage: 10,
    groupsPerPage: 6
  }
};

// Constantes de la aplicación
export const APP_CONSTANTS = {
  // Estados de tareas
  taskStatus: {
    TODO: 'to do',
    IN_PROGRESS: 'in progress',
    REVIEW: 'review',
    DONE: 'done'
  },
  
  // Prioridades de tareas
  taskPriority: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },
  
  // Roles de usuario
  userRole: {
    USER: 'user',
    ADMIN: 'admin'
  }
};

// Formatos para mostrar fechas
export const DATE_FORMATS = {
  short: { year: 'numeric', month: 'numeric', day: 'numeric' },
  medium: { year: 'numeric', month: 'short', day: 'numeric' },
  long: { year: 'numeric', month: 'long', day: 'numeric' },
  withTime: { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
};
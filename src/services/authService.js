import api from './api';

// Servicio para la autenticación
export const authService = {
  // Registrar un nuevo usuario
  async register(username, email, password) {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      // Re-lanzar el error con el mensaje del servidor si está disponible
      if (error.response && error.response.data && error.response.data.msg) {
        const serverError = new Error(error.response.data.msg);
        serverError.response = error.response;
        throw serverError;
      }
      throw error;
    }
  },
  
  // Iniciar sesión
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      // Re-lanzar el error con el mensaje del servidor si está disponible
      if (error.response && error.response.data && error.response.data.msg) {
        const serverError = new Error(error.response.data.msg);
        serverError.response = error.response;
        throw serverError;
      }
      throw error;
    }
  },
  
  // Obtener el usuario actual con el token
  async getCurrentUser() {
    try {
      const response = await api.get('/users/me');
      return response.data.user;
    } catch (error) {
      // Re-lanzar el error con el mensaje del servidor si está disponible
      if (error.response && error.response.data && error.response.data.msg) {
        const serverError = new Error(error.response.data.msg);
        serverError.response = error.response;
        throw serverError;
      }
      throw error;
    }
  },

  // Cerrar sesión (limpia el token del almacenamiento local)
  logout() {
    localStorage.removeItem('token');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener el token actual
  getToken() {
    return localStorage.getItem('token');
  },

  // Guardar token en localStorage
  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
};
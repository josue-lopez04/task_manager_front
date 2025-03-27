import api from './api';

// Servicio para los usuarios
export const userService = {
  // Obtener todos los usuarios
  async getAllUsers() {
    const response = await api.get('/users');
    return response.data.users;
  },
  
  // Obtener un usuario por ID
  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data.user;
  },
  
  // Actualizar rol de usuario (solo admin)
  async updateUserRole(userId, roleData) {
    const response = await api.patch(`/users/${userId}/role`, roleData);
    return response.data.user;
  }
};
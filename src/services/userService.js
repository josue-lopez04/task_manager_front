// File: src/services/userService.js
import api from './api';

// Get all users
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Get a single user
export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Update user role (admin only)
export const updateUserRole = async (userId, roleData) => {
  const response = await api.patch(`/users/${userId}/role`, roleData);
  return response.data;
};
import React, { createContext, useContext, useState, useCallback } from 'react';
import { userService } from '../services/userService';

// Crear el contexto
const UserContext = createContext();

// Hook personalizado para usar el contexto
export const useUserContext = () => useContext(UserContext);

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los usuarios
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener un usuario específico
  const getUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      return await userService.getUser(userId);
    } catch (err) {
      setError(err.message || 'Failed to fetch user');
      console.error('Error fetching user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar el rol de un usuario (solo admin)
  const updateUserRole = async (userId, roleData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.updateUserRole(userId, roleData);
      setUsers(users.map(user => user._id === userId ? updatedUser : user));
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update user role');
      console.error('Error updating user role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    users,
    loading,
    error,
    fetchUsers,
    getUser,
    updateUserRole
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
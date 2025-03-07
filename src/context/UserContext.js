// File: src/context/UserContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single user
  const getUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch user');
      console.error('Error fetching user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user role (admin only)
  const updateUserRole = async (userId, roleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`${API_URL}/users/${userId}/role`, roleData);
      
      // Update user in local state
      setUsers(users.map(user => 
        user._id === userId ? response.data.user : user
      ));
      
      return response.data.user;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update user role');
      console.error('Error updating user role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        fetchUsers,
        getUser,
        updateUserRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
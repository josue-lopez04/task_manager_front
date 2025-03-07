// File: src/context/AuthContext.js (updated)

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      if (token) {
        // Configure axios to use the token for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          // Get user data
          const response = await axios.get(`${API_URL}/users/me`);
          if (response.data && response.data.user) {
            setUser(response.data.user);
          } else {
            // If no user data returned, clear token
            console.error('No user data returned');
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (err) {
          console.error('Token verification failed:', err);
          // If token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
          // Remove authorization header
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [token]);

  // Register user
  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      
      // Save token to local storage
      localStorage.setItem('token', newToken);
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      // Configure axios for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      
      // Save token to local storage
      localStorage.setItem('token', newToken);
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      // Configure axios for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    
    // Update state
    setToken(null);
    setUser(null);
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
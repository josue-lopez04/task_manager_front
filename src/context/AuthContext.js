import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (token) {
        try {
          setLoading(true);
          const userData = await authService.getCurrentUser(token);
          setUser(userData);
        } catch (err) {
          console.error('Token verification failed:', err);
          localStorage.removeItem('token');
          setToken(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [token]);

  // Registro de usuario
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { user: userData, token: newToken } = await authService.register(username, email, password);
      const response = await authService.register(username, email, password);
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return userData;
      return response;
    } catch (err) {
      setError(err.message || 'Error during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login de usuario
// src/context/AuthContext.js (fragmento)
// En la función login de src/context/AuthContext.js 
const login = async (email, password) => {
  try {
    setLoading(true);
    setError(null);
    const response = await api.post('/auth/login', { email, password }); // Asegúrate de que api está importado correctamente
    
    // Si todo va bien con el login, guardar información y token
    const { user: userData, token: newToken } = response.data;
    
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    
    return userData;
  } catch (err) {
    setError(err.message || 'Error during login');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Logout de usuario
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Valor del contexto
  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
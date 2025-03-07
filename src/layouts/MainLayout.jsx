// File: src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// En src/layouts/MainLayout.jsx
import './MainLayout.css';

const MainLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Task Manager</h2>
          <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard"
                className={`block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/dashboard') ? 'bg-blue-50 text-blue-600 font-medium' : ''
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/tasks"
                className={`block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/tasks') ? 'bg-blue-50 text-blue-600 font-medium' : ''
                }`}
              >
                My Tasks
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/groups"
                className={`block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/groups') ? 'bg-blue-50 text-blue-600 font-medium' : ''
                }`}
              >
                Groups
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li className="mb-2">
                <Link
                  to="/admin"
                  className={`block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive('/admin') ? 'bg-blue-50 text-blue-600 font-medium' : ''
                  }`}
                >
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>
          <div className="mt-8 px-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-md transition"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              {location.pathname.includes('/dashboard') && 'Dashboard'}
              {location.pathname.includes('/tasks') && 'Tasks'}
              {location.pathname.includes('/groups') && 'Groups'}
              {location.pathname.includes('/admin') && 'Admin Panel'}
            </h1>
            <div className="flex items-center space-x-2">
              {user?.role === 'admin' && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Admin
                </span>
              )}
              <span className="text-sm text-gray-600">{user?.email}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
        <footer className="bg-white border-t py-3 px-6">
          <div className="text-center text-sm text-gray-500">
            Task Manager &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
// File: src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { GroupProvider } from './context/GroupContext';
import { UserProvider } from './context/UserContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import TasksPage from './pages/Tasks/TasksPage';
import TaskDetailPage from './pages/Tasks/TaskDetailPage';
import TaskCreatePage from './pages/Tasks/TaskCreatePage';
import TaskEditPage from './pages/Tasks/TaskEditPage';
import GroupsPage from './pages/Groups/GroupsPage';
import GroupDetailPage from './pages/Groups/GroupDetailPage';
import GroupCreatePage from './pages/Groups/GroupCreatePage';
import GroupEditPage from './pages/Groups/GroupEditPage';
import AdminPage from './pages/Admin/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Private Route component for authentication
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route component for authorization
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route component to redirect authenticated users
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
      <AuthProvider>
        <TaskProvider>
          <GroupProvider>
            <UserProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

                {/* Protected routes */}
                <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  
                  <Route path="tasks" element={<TasksPage />} />
                  <Route path="tasks/create" element={<TaskCreatePage />} />
                  <Route path="tasks/:taskId" element={<TaskDetailPage />} />
                  <Route path="tasks/:taskId/edit" element={<TaskEditPage />} />
                  
                  <Route path="groups" element={<GroupsPage />} />
                  <Route path="groups/create" element={<GroupCreatePage />} />
                  <Route path="groups/:groupId" element={<GroupDetailPage />} />
                  <Route path="groups/:groupId/edit" element={<GroupEditPage />} />
                  
                  {/* Admin routes */}
                  <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                </Route>

                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </UserProvider>
          </GroupProvider>
        </TaskProvider>
      </AuthProvider>
  );
}

export default App;
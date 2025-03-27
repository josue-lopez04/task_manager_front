// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

// Protected Routes
import { PrivateRoute, PublicRoute, AdminRoute } from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <GroupProvider>
            <UserProvider>
              <Routes>
                {/* Public routes */}
                <Route element={<PublicRoute />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Protected routes */}
                <Route element={<PrivateRoute />}>
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/tasks/create" element={<TaskCreatePage />} />
                    <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
                    <Route path="/tasks/:taskId/edit" element={<TaskEditPage />} />
                    
                    <Route path="/groups" element={<GroupsPage />} />
                    <Route path="/groups/create" element={<GroupCreatePage />} />
                    <Route path="/groups/:groupId" element={<GroupDetailPage />} />
                    <Route path="/groups/:groupId/edit" element={<GroupEditPage />} />
                  </Route>
                </Route>

                {/* Admin routes */}
                <Route element={<AdminRoute />}>
                  <Route element={<MainLayout />}>
                    <Route path="/admin" element={<AdminPage />} />
                  </Route>
                </Route>

                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </UserProvider>
          </GroupProvider>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
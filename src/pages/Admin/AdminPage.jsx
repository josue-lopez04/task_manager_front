// File: src/pages/Admin/AdminPage.jsx
import React from 'react';
import AdminUserList from '../../components/AdminUserList';
import './Admin.css';

const AdminPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-gray-600">
          Manage users and system settings
        </p>
      </div>

      <AdminUserList />
    </div>
  );
};

export default AdminPage;
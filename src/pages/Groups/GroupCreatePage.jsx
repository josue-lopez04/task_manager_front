// File: src/pages/Groups/GroupCreatePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import GroupForm from '../../components/GroupForm';
import '../../styles/pages.css'


const GroupCreatePage = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Create New Group</h2>
        <p className="text-gray-600">
          Create a new group for collaborative tasks
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <GroupForm />
      </div>

      <div className="mt-4">
        <Link to="/groups" className="text-blue-600 hover:underline">
          Back to groups
        </Link>
      </div>
    </div>
  );
};

export default GroupCreatePage;
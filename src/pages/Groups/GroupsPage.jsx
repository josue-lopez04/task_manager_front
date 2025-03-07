// File: src/pages/Groups/GroupsPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGroupContext } from '../../context/GroupContext';
import GroupCard from '../../components/GroupCard';
import '../../styles/pages.css'

const GroupsPage = () => {
  const { groups, loading, error, fetchGroups } = useGroupContext();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Groups</h2>
        <Link
          to="/groups/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Group
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading groups...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500 mb-4">You don't have any groups yet.</p>
          <Link
            to="/groups/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create your first group
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
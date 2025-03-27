// File: src/pages/Groups/GroupsPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGroupContext } from '../../context/GroupContext';
import GroupCard from '../../components/GroupCard';

const GroupsPage = () => {
  const { groups, loading, error, fetchGroups } = useGroupContext();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800">My Groups</h2>
        <Link
          to="/groups/create"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          New Group
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin mb-3"></div>
            <p className="text-gray-600 font-medium">Loading groups...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error Occurred</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => fetchGroups()} 
            className="mt-4 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-3xl text-blue-500">+</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Groups Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first group to start collaborating with others on tasks and projects.</p>
          <Link
            to="/groups/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm inline-block font-medium"
          >
            Create your first group
          </Link>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div key={group._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{group.name}</h3>
                  {group.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>
                  )}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {group.members ? group.members.length : 0} {group.members?.length === 1 ? 'member' : 'members'}
                    </span>
                    <Link
                      to={`/groups/${group._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {groups.length} {groups.length === 1 ? 'group' : 'groups'}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
// File: src/components/UserSelector.jsx
import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';

const UserSelector = ({ onSelect, selectedUserId, excludeUsers = [] }) => {
  const { users, fetchUsers, loading } = useUserContext();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (users && users.length > 0) {
      // Filter users based on excludeUsers array and search term
      const filtered = users.filter(
        (user) => 
          !excludeUsers.includes(user._id) && 
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [users, excludeUsers, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = (userId) => {
    onSelect(userId);
  };

  return (
    <div className="mt-4">
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No users found</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <li key={user._id} className="p-2 hover:bg-gray-50">
                <button
                  type="button"
                  onClick={() => handleSelect(user._id)}
                  className={`w-full text-left px-2 py-1 rounded-md ${
                    selectedUserId === user._id ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <div className="font-medium">{user.username}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserSelector;

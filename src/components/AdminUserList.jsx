// File: src/components/AdminUserList.jsx
import React, { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';

const AdminUserList = () => {
  const { users, fetchUsers, updateUserRole, loading, error } = useUserContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('user');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleUpdateRole = async () => {
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      await updateUserRole(selectedUser._id, { role: selectedRole });
      setUpdateSuccess(`User role updated successfully to ${selectedRole}`);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setUpdateError(err.response?.data?.msg || 'Failed to update user role');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 pr-0 md:pr-4">
              <h4 className="font-medium text-gray-700 mb-2">Users</h4>
              <div className="border rounded-md overflow-y-auto max-h-96">
                <ul className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <li key={user._id}>
                      <button
                        onClick={() => handleUserSelect(user)}
                        className={`w-full text-left p-3 hover:bg-gray-50 ${
                          selectedUser?._id === user._id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {user.role}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:w-1/2 mt-4 md:mt-0">
              <h4 className="font-medium text-gray-700 mb-2">Edit User</h4>
              {selectedUser ? (
                <div className="border rounded-md p-4">
                  <div className="mb-4">
                    <p className="font-medium">{selectedUser.username}</p>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>

                  {updateError && (
                    <div className="mb-4 bg-red-50 p-3 rounded text-red-600 text-sm">
                      {updateError}
                    </div>
                  )}

                  {updateSuccess && (
                    <div className="mb-4 bg-green-50 p-3 rounded text-green-600 text-sm">
                      {updateSuccess}
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={selectedRole}
                      onChange={handleRoleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleUpdateRole}
                    disabled={updateLoading || selectedRole === selectedUser.role}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {updateLoading ? 'Updating...' : 'Update Role'}
                  </button>
                </div>
              ) : (
                <div className="border rounded-md p-4 text-center text-gray-500">
                  Select a user to edit
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;
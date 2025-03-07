// File: src/pages/Groups/GroupDetailPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGroupContext } from '../../context/GroupContext';
import { useTaskContext } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import TaskForm from '../../components/TaskForm';
import UserSelector from '../../components/UserSelector';
import '../../styles/pages.css'


const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { getGroup, deleteGroup, addGroupMember, removeGroupMember } = useGroupContext();
  const { updateTask } = useTaskContext();
  const { user } = useAuth();
  
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  // Function to fetch group data and tasks
  const fetchGroupData = useCallback(async () => {
    if (isPolling) return; // Prevent multiple concurrent requests
    
    setIsPolling(true);
    try {
      const { group: groupData, tasks: tasksData } = await getGroup(groupId);
      setGroup(groupData);
      setTasks(tasksData);
      if (loading) setLoading(false);
    } catch (err) {
      console.error('Error fetching group data:', err);
      setError(err.message || 'Failed to load group');
      setLoading(false);
    } finally {
      setIsPolling(false);
    }
  }, [groupId, getGroup, loading, isPolling]);

  useEffect(() => {
    // Initial fetch
    fetchGroupData();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchGroupData();
    }, 3000); // Poll every 3 seconds
    
    return () => clearInterval(interval);
  }, [fetchGroupData]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this group? All associated tasks will be deleted.')) {
      try {
        await deleteGroup(groupId);
        navigate('/groups');
      } catch (err) {
        setError(err.message || 'Failed to delete group');
      }
    }
  };

  const handleAddMember = async (e) => {
    if (e) e.preventDefault();
    if (!selectedUserId) return;
    
    try {
      const updatedGroup = await addGroupMember(groupId, selectedUserId);
      setGroup(updatedGroup);
      setShowAddMember(false);
      setSelectedUserId('');
    } catch (err) {
      setError(err.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member from the group?')) {
      try {
        const updatedGroup = await removeGroupMember(groupId, memberId);
        setGroup(updatedGroup);
      } catch (err) {
        setError(err.message || 'Failed to remove member');
      }
    }
  };

  const handleTaskStatusUpdate = async (taskId, taskData) => {
    try {
      await updateTask(taskId, taskData);
      // Manual fetch after update to ensure UI is in sync
      fetchGroupData();
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading group...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Error: {error}</p>
        <Link to="/groups" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to groups
        </Link>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-600">Group not found</p>
        <Link to="/groups" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to groups
        </Link>
      </div>
    );
  }

  const isCreator = group.createdBy && user && group.createdBy._id === user.userId;

  return (
    <div className="pb-16">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{group.name}</h2>
          {group.description && (
            <p className="text-gray-600 mt-1">{group.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          {isCreator && (
            <>
              <Link
                to={`/groups/${groupId}/edit`}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 p-3 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tasks</h3>
              {isCreator && (
                <button
                  type="button"
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  {showTaskForm ? 'Cancel' : 'Add Task'}
                </button>
              )}
            </div>

            {showTaskForm && (
              <div className="mb-6 border-b pb-6">
                <h4 className="font-medium mb-3">Create New Task</h4>
                <TaskForm groupId={groupId} />
              </div>
            )}

            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No tasks in this group yet.
                {isCreator && ' Click "Add Task" to create one.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {["todo", "in progress", "review", "done"].map((status) => (
                  <div key={status} className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3 capitalize">
                      {status === "in progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </h4>
                    <div className="space-y-3">
                      {tasks
                        .filter(task => task.status === status)
                        .map(task => (
                          <div key={task._id} className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                            <h5 className="font-semibold">{task.title}</h5>
                            {task.description && (
                              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                            )}
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {task.priority}
                              </span>
                              {task.assignedTo && (
                                <span className="text-xs text-gray-500">
                                  Assigned to: {task.assignedTo.username}
                                </span>
                              )}
                            </div>
                            {(isCreator || (task.assignedTo && task.assignedTo._id === user?.userId)) && (
                              <div className="mt-2">
                                <select
                                  value={task.status}
                                  onChange={(e) => handleTaskStatusUpdate(task._id, { status: e.target.value })}
                                  className="text-xs w-full rounded border-gray-300"
                                >
                                  <option value="todo">To Do</option>
                                  <option value="in progress">In Progress</option>
                                  <option value="review">Review</option>
                                  <option value="done">Done</option>
                                </select>
                              </div>
                            )}
                          </div>
                        ))}
                      {tasks.filter(task => task.status === status).length === 0 && (
                        <p className="text-gray-500 text-sm text-center">No tasks</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white shadow-sm rounded-lg p-4 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Members</h3>
              {isCreator && (
                <button
                  type="button"
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  {showAddMember ? 'Cancel' : 'Add Member'}
                </button>
              )}
            </div>

            {showAddMember && (
              <div className="mb-4 border-b pb-4">
                <h4 className="font-medium mb-2">Select User</h4>
                <UserSelector
                  onSelect={setSelectedUserId}
                  selectedUserId={selectedUserId}
                  excludeUsers={group.members.map(member => member._id)}
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={!selectedUserId}
                  className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  Add to Group
                </button>
              </div>
            )}

            <ul className="divide-y divide-gray-200">
              {group.members && group.members.map((member) => (
                <li key={member._id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{member.username}</div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                  </div>
                  <div className="flex items-center">
                    {group.createdBy && member._id === group.createdBy._id && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                        Creator
                      </span>
                    )}
                    {isCreator && group.createdBy && member._id !== group.createdBy._id && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <Link to="/groups" className="text-blue-600 hover:underline">
              Back to groups
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
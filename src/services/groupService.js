// File: src/services/groupService.js
import api from './api';

// Get all groups for current user
export const getGroups = async () => {
  const response = await api.get('/groups');
  return response.data;
};

// Get a single group with its tasks
export const getGroup = async (groupId) => {
  const response = await api.get(`/groups/${groupId}`);
  return response.data;
};

// Create a new group
export const createGroup = async (groupData) => {
  const response = await api.post('/groups', groupData);
  return response.data;
};

// Update a group
export const updateGroup = async (groupId, groupData) => {
  const response = await api.patch(`/groups/${groupId}`, groupData);
  return response.data;
};

// Add a member to a group
export const addGroupMember = async (groupId, memberId) => {
  const response = await api.post(`/groups/${groupId}/members`, { memberId });
  return response.data;
};

// Remove a member from a group
export const removeGroupMember = async (groupId, memberId) => {
  const response = await api.delete(`/groups/${groupId}/members`, {
    data: { memberId }
  });
  return response.data;
};

// Delete a group
export const deleteGroup = async (groupId) => {
  const response = await api.delete(`/groups/${groupId}`);
  return response.data;
};
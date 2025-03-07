// File: src/context/GroupContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const GroupContext = createContext();

export const useGroupContext = () => useContext(GroupContext);

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all groups for the current user
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/groups`);
      setGroups(response.data.groups);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch groups');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single group with its tasks
  const getGroup = async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/groups/${groupId}`);
      return {
        group: response.data.group,
        tasks: response.data.tasks
      };
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch group');
      console.error('Error fetching group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new group
  const createGroup = async (groupData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/groups`, groupData);
      setGroups([...groups, response.data.group]);
      return response.data.group;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create group');
      console.error('Error creating group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a group
  const updateGroup = async (groupId, groupData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`${API_URL}/groups/${groupId}`, groupData);
      
      // Update group in local state
      setGroups(groups.map(group => 
        group._id === groupId ? response.data.group : group
      ));
      
      return response.data.group;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update group');
      console.error('Error updating group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a member to a group
  const addGroupMember = async (groupId, memberId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/groups/${groupId}/members`, { memberId });
      
      // Update group in local state
      setGroups(groups.map(group => 
        group._id === groupId ? response.data.group : group
      ));
      
      return response.data.group;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add member to group');
      console.error('Error adding member to group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove a member from a group
  const removeGroupMember = async (groupId, memberId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${API_URL}/groups/${groupId}/members`, {
        data: { memberId }
      });
      
      // Update group in local state
      setGroups(groups.map(group => 
        group._id === groupId ? response.data.group : group
      ));
      
      return response.data.group;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to remove member from group');
      console.error('Error removing member from group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a group
  const deleteGroup = async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/groups/${groupId}`);
      
      // Remove group from local state
      setGroups(groups.filter(group => group._id !== groupId));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete group');
      console.error('Error deleting group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        loading,
        error,
        fetchGroups,
        getGroup,
        createGroup,
        updateGroup,
        addGroupMember,
        removeGroupMember,
        deleteGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

import React, { createContext, useContext, useState, useCallback } from 'react';
import { groupService } from '../services/groupService';

// Crear el contexto
const GroupContext = createContext();

// Hook personalizado para usar el contexto
export const useGroupContext = () => useContext(GroupContext);

// Proveedor del contexto
export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los grupos del usuario actual
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const groupsData = await groupService.getAllGroups();
      setGroups(groupsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch groups');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener un grupo específico
  const getGroup = async (groupId) => {
    try {
      setLoading(true);
      setError(null);
      return await groupService.getGroup(groupId);
    } catch (err) {
      setError(err.message || 'Failed to fetch group');
      console.error('Error fetching group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo grupo
  const createGroup = async (groupData) => {
    try {
      setLoading(true);
      setError(null);
      const newGroup = await groupService.createGroup(groupData);
      setGroups([...groups, newGroup]);
      return newGroup;
    } catch (err) {
      setError(err.message || 'Failed to create group');
      console.error('Error creating group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un grupo existente
  const updateGroup = async (groupId, groupData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedGroup = await groupService.updateGroup(groupId, groupData);
      setGroups(groups.map(group => group._id === groupId ? updatedGroup : group));
      return updatedGroup;
    } catch (err) {
      setError(err.message || 'Failed to update group');
      console.error('Error updating group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Añadir miembro a un grupo
  const addGroupMember = async (groupId, memberId) => {
    try {
      setLoading(true);
      setError(null);
      const updatedGroup = await groupService.addGroupMember(groupId, memberId);
      setGroups(groups.map(group => group._id === groupId ? updatedGroup : group));
      return updatedGroup;
    } catch (err) {
      setError(err.message || 'Failed to add member to group');
      console.error('Error adding member to group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar miembro de un grupo
  const removeGroupMember = async (groupId, memberId) => {
    try {
      setLoading(true);
      setError(null);
      const updatedGroup = await groupService.removeGroupMember(groupId, memberId);
      setGroups(groups.map(group => group._id === groupId ? updatedGroup : group));
      return updatedGroup;
    } catch (err) {
      setError(err.message || 'Failed to remove member from group');
      console.error('Error removing member from group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un grupo
  const deleteGroup = async (groupId) => {
    try {
      setLoading(true);
      setError(null);
      await groupService.deleteGroup(groupId);
      setGroups(groups.filter(group => group._id !== groupId));
    } catch (err) {
      setError(err.message || 'Failed to delete group');
      console.error('Error deleting group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    groups,
    loading,
    error,
    fetchGroups,
    getGroup,
    createGroup,
    updateGroup,
    addGroupMember,
    removeGroupMember,
    deleteGroup
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};
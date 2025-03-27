import api from './api';

// Servicio para los grupos
export const groupService = {
  // Obtener todos los grupos
  async getAllGroups() {
    const response = await api.get('/groups');
    return response.data.groups;
  },
  
  // Obtener un grupo por ID
  async getGroup(groupId) {
    const response = await api.get(`/groups/${groupId}`);
    return {
      group: response.data.group,
      tasks: response.data.tasks
    };
  },
  
  // Crear un nuevo grupo
  async createGroup(groupData) {
    const response = await api.post('/groups', groupData);
    return response.data.group;
  },
  
  // Actualizar un grupo
  async updateGroup(groupId, groupData) {
    const response = await api.patch(`/groups/${groupId}`, groupData);
    return response.data.group;
  },
  
  // Añadir miembro a un grupo
  async addGroupMember(groupId, memberId) {
    const response = await api.post(`/groups/${groupId}/members`, { memberId });
    return response.data.group;
  },
  
  // Eliminar miembro de un grupo
  async removeGroupMember(groupId, memberId) {
    const response = await api.delete(`/groups/${groupId}/members`, { 
      data: { memberId } 
    });
    return response.data.group;
  },
  
  // Eliminar un grupo
  async deleteGroup(groupId) {
    const response = await api.delete(`/groups/${groupId}`);
    return response.data;
  }
};
import api from './api';

export const solicitudService = {
  getAll: async (params = {}) => {
    const response = await api.get('/solicitudes', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/solicitudes/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/solicitudes', data);
    return response.data;
  },

  cambiarEstatus: async (id, estatus, comentario) => {
    const response = await api.patch(`/solicitudes/${id}/estatus`, {
      estatus,
      comentario,
    });
    return response.data;
  },
};

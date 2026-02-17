import api from './api';

export const solicitudesService = {
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

  updateEstatus: async (id, nuevo_estatus, comentarios) => {
    const response = await api.patch(`/solicitudes/${id}/estatus`, {
      nuevo_estatus,
      comentarios,
    });
    return response.data;
  },
};

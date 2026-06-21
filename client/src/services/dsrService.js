import apiClient from './apiClient';

export const dsrService = {
  getAll: (params) => apiClient.get('/dsr', { params }),
  getById: (id) => apiClient.get(`/dsr/${id}`),
  create: (data) => apiClient.post('/dsr', data),
  settle: (id, data) => apiClient.post(`/dsr/${id}/settle`, data),
  getSheet: (id) => apiClient.get(`/dsr/${id}/sheet`),
};

import apiClient from './apiClient';

export const returnService = {
  getAll: (params) => apiClient.get('/returns', { params }),
  getById: (id) => apiClient.get(`/returns/${id}`),
  create: (data) => apiClient.post('/returns', data),
};

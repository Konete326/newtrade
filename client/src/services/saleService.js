import apiClient from './apiClient';

export const saleService = {
  getAll: (params) => apiClient.get('/sales', { params }),
  getById: (id) => apiClient.get(`/sales/${id}`),
  create: (data) => apiClient.post('/sales', data),
  delete: (id) => apiClient.delete(`/sales/${id}`),
};

import apiClient from './apiClient';

export const purchaseService = {
  getAll: (params) => apiClient.get('/purchases', { params }),
  getById: (id) => apiClient.get(`/purchases/${id}`),
  create: (data) => apiClient.post('/purchases', data),
  delete: (id) => apiClient.delete(`/purchases/${id}`),
};

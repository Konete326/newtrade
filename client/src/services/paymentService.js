import apiClient from './apiClient';

export const paymentService = {
  getAll: (params) => apiClient.get('/payments', { params }),
  getById: (id) => apiClient.get(`/payments/${id}`),
  create: (data) => apiClient.post('/payments', data),
  delete: (id) => apiClient.delete(`/payments/${id}`),
};

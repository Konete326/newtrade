import apiClient from './apiClient';

export const expenseService = {
  getAll: (params) => apiClient.get('/expenses', { params }),
  getById: (id) => apiClient.get(`/expenses/${id}`),
  create: (data) => apiClient.post('/expenses', data),
  approve: (id) => apiClient.post(`/expenses/${id}/approve`),
  reject: (id, data) => apiClient.post(`/expenses/${id}/reject`, data),
  delete: (id) => apiClient.delete(`/expenses/${id}`),
};

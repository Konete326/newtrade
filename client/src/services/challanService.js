import apiClient from './apiClient';

export const challanService = {
  getAll: (params) => apiClient.get('/challans', { params }),
  getById: (id) => apiClient.get(`/challans/${id}`),
  create: (data) => apiClient.post('/challans', data),
  updateStatus: (id, data) => apiClient.patch(`/challans/${id}/status`, data),
};

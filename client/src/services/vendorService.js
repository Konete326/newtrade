import apiClient from './apiClient';

export const vendorService = {
  getAll: (params) => apiClient.get('/vendors', { params }),
  getById: (id) => apiClient.get(`/vendors/${id}`),
  create: (data) => apiClient.post('/vendors', data),
  update: (id, data) => apiClient.put(`/vendors/${id}`, data),
  delete: (id) => apiClient.delete(`/vendors/${id}`),
  getLedger: (id, params) => apiClient.get(`/vendors/${id}/ledger`, { params }),
};

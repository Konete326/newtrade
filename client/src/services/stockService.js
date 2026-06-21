import apiClient from './apiClient';

export const stockService = {
  getAll: (params) => apiClient.get('/stock', { params }),
  adjust: (data) => apiClient.post('/stock/adjust', data),
  transfer: (data) => apiClient.post('/stock/transfer', data),
};

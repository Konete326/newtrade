import apiClient from './apiClient';

export const productService = {
  getAll: (params) => apiClient.get('/products', { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
  findByBarcode: (code) => apiClient.get(`/products/barcode/${code}`),
  getNextBarcode: () => apiClient.get('/products/next-barcode'),
};

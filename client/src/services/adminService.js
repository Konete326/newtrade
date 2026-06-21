import apiClient from './apiClient';

export const adminService = {
  getHealth: () => apiClient.get('/admin/health'),
  getTenants: () => apiClient.get('/admin/tenants'),
  getTenantById: (id) => apiClient.get(`/admin/tenants/${id}`),
  createTenant: (data) => apiClient.post('/admin/tenants', data),
  updateTenant: (id, data) => apiClient.put(`/admin/tenants/${id}`, data),
  suspendTenant: (id) => apiClient.post(`/admin/tenants/${id}/suspend`),
  activateTenant: (id) => apiClient.post(`/admin/tenants/${id}/activate`),
};

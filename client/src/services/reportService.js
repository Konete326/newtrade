import apiClient from './apiClient';

export const reportService = {
  sales: (params) => apiClient.get('/reports/sales', { params }),
  stock: (params) => apiClient.get('/reports/stock', { params }),
  expenses: (params) => apiClient.get('/reports/expenses', { params }),
  profitLoss: (params) => apiClient.get('/reports/profit-loss', { params }),
  aiInsight: () => apiClient.get('/reports/ai/insight'),
  askJarvis: (data) => apiClient.post('/reports/ai/jarvis', data),
};

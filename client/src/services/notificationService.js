import apiClient from './apiClient';

export const notificationService = {
  getAll: (params) => apiClient.get('/notifications', { params }),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markAsRead: (notificationId) => apiClient.post('/notifications/mark-read', { notificationId }),
  markAllRead: () => apiClient.post('/notifications/mark-read', {}),
};

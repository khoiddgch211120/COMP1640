import apiClient from './apiClient';

const notificationService = {
  getNotifications: (page = 0, size = 20) =>
    apiClient.get('/api/notifications', { params: { page, size } }).then((res) => res.data),

  getUnreadCount: () =>
    apiClient.get('/api/notifications/unread-count').then((res) => res.data),

  markAsRead: (notificationId) =>
    apiClient.patch(`/api/notifications/${notificationId}/read`),

  markAllAsRead: () =>
    apiClient.patch('/api/notifications/read-all'),
};

export default notificationService;

import { useSelector, useDispatch } from 'react-redux';
import {
  addNotification,
  markOneAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  fetchNotifications,
  fetchUnreadCount,
  markOneAsReadAsync,
  markAllAsReadAsync,
} from '../redux/slices/notificationSlice';

/**
 * Hook để sử dụng notifications
 * @returns {object} Object chứa notifications state và các action
 */
export const useNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);

  return {
    messages: notifications.messages,
    unreadCount: notifications.unreadCount,
    isLoading: notifications.isLoading,
    error: notifications.error,
    totalPages: notifications.totalPages,
    currentPage: notifications.currentPage,

    // Load notifications from database
    loadNotifications: (page = 0, size = 20) => {
      dispatch(fetchNotifications({ page, size }));
    },

    loadUnreadCount: () => {
      dispatch(fetchUnreadCount());
    },

    // Actions (local - for WebSocket real-time)
    addNotification: (notification) => {
      dispatch(addNotification(notification));
    },

    // Actions (API - persist to database)
    markAsRead: (notificationId) => {
      dispatch(markOneAsReadAsync(notificationId));
    },

    markAllAsRead: () => {
      dispatch(markAllAsReadAsync());
    },

    removeNotification: (notificationId) => {
      dispatch(removeNotification(notificationId));
    },

    clearNotifications: () => {
      dispatch(clearNotifications());
    },

    // Filter helpers
    getRecentNotifications: (limit = 5) => {
      return notifications.messages.slice(0, limit);
    },

    getUnreadNotifications: () => {
      return notifications.messages.filter((n) => !n.isRead);
    },

    getReadNotifications: () => {
      return notifications.messages.filter((n) => n.isRead);
    },

    getNotificationsByType: (type) => {
      return notifications.messages.filter((n) => n.type === type);
    },
  };
};

export default useNotifications;
export { useNotifications };

import { useSelector, useDispatch } from 'react-redux';
import {
  addNotification,
  markOneAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
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

    // Actions
    addNotification: (notification) => {
      dispatch(addNotification(notification));
    },

    markAsRead: (notificationId) => {
      dispatch(markOneAsRead(notificationId));
    },

    markAllAsRead: () => {
      dispatch(markAllAsRead());
    },

    removeNotification: (notificationId) => {
      dispatch(removeNotification(notificationId));
    },

    clearNotifications: () => {
      dispatch(clearNotifications());
    },

    // Pagination helper
    getRecentNotifications: (limit = 5) => {
      return notifications.messages.slice(0, limit);
    },

    // Filter helpers
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

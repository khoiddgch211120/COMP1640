import { useState } from 'react';
import { useNotifications } from '../services/useNotifications';
import './NotificationBell.css';

/**
 * Notification Bell Component - Hiển thị số lượng thông báo chưa đọc
 */
export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    unreadCount,
    getRecentNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const recentNotifications = getRecentNotifications(5);

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleRemove = (id) => {
    removeNotification(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_IDEA':
        return '💡';
      case 'NEW_COMMENT':
        return '💬';
      case 'COMMENT_LIKED':
        return '👍';
      case 'IDEA_COMPLETED':
        return '✅';
      case 'IDEA_REJECTED':
        return '❌';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'NEW_IDEA':
        return '#3b82f6'; // blue
      case 'NEW_COMMENT':
        return '#6366f1'; // indigo
      case 'IDEA_COMPLETED':
        return '#10b981'; // green
      case 'IDEA_REJECTED':
        return '#ef4444'; // red
      default:
        return '#8b5cf6'; // purple
    }
  };

  return (
    <div className="notification-bell">
      {/* Bell Icon */}
      <button
        className={`bell-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Thông báo"
      >
        🔔
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="notification-dropdown">
          {/* Header */}
          <div className="notification-header">
            <h3>Thông báo ({messages.length})</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
                title="Đánh dấu tất cả đã đọc"
              >
                ✓ Đánh dấu tất cả
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="notification-list">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                  style={{
                    borderLeftColor: getNotificationColor(notification.type),
                  }}
                >
                  {/* Icon */}
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="notification-content">
                    <p className="notification-title">{notification.title}</p>
                    <p className="notification-message">{notification.message}</p>
                    {notification.createdAt && (
                      <span className="notification-time">
                        {new Date(notification.createdAt).toLocaleString('vi-VN')}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        className="action-btn"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Đánh dấu đã đọc"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      className="action-btn remove-btn"
                      onClick={() => handleRemove(notification.id)}
                      title="Xóa"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>🔔 Không có thông báo nào</p>
              </div>
            )}
          </div>

          {/* Footer - Link to all notifications */}
          {messages.length > 5 && (
            <div className="notification-footer">
              <a href="/notifications" className="view-all-link">
                Xem tất cả thông báo ({messages.length})
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

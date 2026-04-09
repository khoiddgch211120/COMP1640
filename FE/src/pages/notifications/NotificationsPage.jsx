import { useState } from 'react';
import { useNotifications } from '../../services/useNotifications';
import './NotificationsPage.css';

/**
 * Notifications Page - Hiển thị tất cả thông báo
 */
export default function NotificationsPage() {
  const {
    messages,
    getUnreadNotifications,
    getReadNotifications,
    markAsRead,
    removeNotification,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'oldest'

  // Filter notifications
  const getFilteredNotifications = () => {
    let notifs = messages;

    if (filter === 'unread') {
      notifs = getUnreadNotifications();
    } else if (filter === 'read') {
      notifs = getReadNotifications();
    }

    // Sort
    if (sortBy === 'oldest') {
      return [...notifs].reverse();
    }
    return notifs;
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = getUnreadNotifications().length;
  const readCount = getReadNotifications().length;

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

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleRemove = (id) => {
    removeNotification(id);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;

    return formatTime(dateString);
  };

  return (
    <div className="notifications-page">
      {/* Header */}
      <div className="notifications-header">
        <h1>🔔 Thông báo ({messages.length})</h1>
        <p className="subtitle">
          Chưa đọc: <strong>{unreadCount}</strong> | Đã đọc: <strong>{readCount}</strong>
        </p>
      </div>

      {/* Toolbar */}
      <div className="notifications-toolbar">
        {/* Filter Buttons */}
        <div className="filter-group">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả ({messages.length})
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Chưa đọc ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Đã đọc ({readCount})
          </button>
        </div>

        {/* Sort & Actions */}
        <div className="action-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>

          {unreadCount > 0 && (
            <button className="action-btn primary" onClick={markAllAsRead}>
              ✓ Đánh dấu tất cả đã đọc
            </button>
          )}

          {messages.length > 0 && (
            <button className="action-btn danger" onClick={clearNotifications}>
              🗑️ Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-container">
        {filteredNotifications.length > 0 ? (
          <div className="notifications-list">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}
                style={{
                  borderLeftColor: getNotificationColor(notification.type),
                }}
              >
                {/* Left: Icon */}
                <div className="card-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Middle: Content */}
                <div className="card-content">
                  <div className="card-header">
                    <h3 className="card-title">{notification.title}</h3>
                    {!notification.isRead && <span className="unread-dot">●</span>}
                  </div>

                  <p className="card-message">{notification.message}</p>

                  {notification.ideaTitle && (
                    <p className="card-meta">
                      <strong>Ý tưởng:</strong> {notification.ideaTitle}
                    </p>
                  )}

                  <div className="card-footer">
                    <span className="card-time" title={formatTime(notification.createdAt)}>
                      {getRelativeTime(notification.createdAt)}
                    </span>
                    <span className="card-type">{notification.type}</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="card-actions">
                  {!notification.isRead && (
                    <button
                      className="action-icon"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Đánh dấu đã đọc"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="action-icon remove"
                    onClick={() => handleRemove(notification.id)}
                    title="Xóa"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>Không có thông báo</h2>
            <p>
              {filter === 'all' && 'Bạn chưa có thông báo nào.'}
              {filter === 'unread' && 'Bạn đã đọc tất cả thông báo.'}
              {filter === 'read' && 'Bạn không có thông báo đã đọc nào.'}
            </p>
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredNotifications.length > 20 && (
        <div className="load-more">
          <button className="load-more-btn">Xem thêm</button>
        </div>
      )}
    </div>
  );
}

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  markOneAsRead,
  markAllAsRead,
  clearNotifications,
} from '../../redux/slices/notificationSlice';
import './NotificationsPage.css';

/* ─── Type helpers ─────────────────────────────── */
const TYPE_CONFIG = {
  NEW_IDEA: { label: 'New Idea', color: '#3b82f6', bg: '#eff6ff' },
  NEW_COMMENT: { label: 'New Comment', color: '#6366f1', bg: '#eef2ff' },
};

const getTypeConfig = (type) =>
  TYPE_CONFIG[type] || { label: type, color: '#8b5cf6', bg: '#f5f3ff' };

/* ─── Relative time ───────────────────────────── */
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleString('vi-VN');
};

/* ─── Icon by type ─────────────────────────────── */
const NotifIcon = ({ type }) => {
  if (type === 'NEW_IDEA') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z" />
        <line x1="9" y1="21" x2="15" y2="21" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════ */
export default function NotificationsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages, unreadCount } = useSelector((s) => s.notifications);
  const { user } = useSelector((s) => s.auth);

  const readCount = messages.filter((m) => m.isRead).length;

  const handleClick = (notif) => {
    if (!notif.isRead) dispatch(markOneAsRead(notif.ideaId));
    if (notif.ideaId) navigate(`/ideas/${notif.ideaId}`);
  };

  return (
    <div className="notif-page">
      {/* ── Header ─────────────────────────── */}
      <div className="notif-page-header">
        <div>
          <h1 className="notif-page-title">Notifications</h1>
          <p className="notif-page-subtitle">
            Thông báo về ý tưởng và bình luận trong department của bạn
          </p>
        </div>
        {messages.length > 0 && (
          <button
            className="notif-page-clear-btn"
            onClick={() => dispatch(clearNotifications())}
          >
            Xoá tất cả
          </button>
        )}
      </div>

      {/* ── Stats bar ──────────────────────── */}
      <div className="notif-page-stats">
        <span className="notif-stat">
          Tổng: <strong>{messages.length}</strong>
        </span>
        <span className="notif-stat">
          Chưa đọc: <strong>{unreadCount}</strong>
        </span>
        <span className="notif-stat">
          Đã đọc: <strong>{readCount}</strong>
        </span>
      </div>

      {/* ── Mark all read ──────────────────── */}
      {unreadCount > 0 && (
        <div className="notif-page-actions">
          <button
            className="notif-mark-all-btn"
            onClick={() => dispatch(markAllAsRead())}
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>
      )}

      {/* ── Notification list ──────────────── */}
      <div className="notif-page-list">
        {messages.length > 0 ? (
          messages.map((notif, idx) => {
            const cfg = getTypeConfig(notif.type);
            return (
              <div
                key={notif.notificationId || notif.ideaId ? `${notif.ideaId}-${idx}` : idx}
                className={`notif-page-card ${notif.isRead ? 'read' : 'unread'}`}
                onClick={() => handleClick(notif)}
              >
                {/* Icon */}
                <div
                  className="notif-page-icon"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  <NotifIcon type={notif.type} />
                </div>

                {/* Content */}
                <div className="notif-page-content">
                  <div className="notif-page-content-top">
                    <span
                      className="notif-page-type-badge"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <h3 className="notif-page-card-title">{notif.title}</h3>
                  <p className="notif-page-card-message">{notif.message}</p>
                  <span className="notif-page-card-time">
                    {timeAgo(notif.createdAt)}
                  </span>
                </div>

                {/* Unread indicator */}
                {!notif.isRead && <span className="notif-page-unread-dot" />}
              </div>
            );
          })
        ) : (
          <div className="notif-page-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
              width="48" height="48" style={{ opacity: 0.3, marginBottom: 12 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h2>Chưa có thông báo</h2>
            <p>Thông báo mới sẽ xuất hiện tại đây khi có ý tưởng hoặc bình luận mới.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { markAllAsReadAsync, markOneAsReadAsync, clearNotifications } from '../redux/slices/notificationSlice';

/* ─── Format relative time ────────────────────────── */
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

/* ─── Icon by type ─────────────────────────────────────── */
const NotifIcon = ({ type }) => {
  if (type === 'NEW_IDEA') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
        <line x1="9" y1="21" x2="15" y2="21"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const NotificationDropdown = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { messages, unreadCount } = useSelector((s) => s.notifications);
  const { user } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  /* ── Close on outside click ───────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Handle notification click ───────────────────────────── */
  const handleClick = (notif) => {
    if (!notif.isRead && notif.notificationId) dispatch(markOneAsReadAsync(notif.notificationId));
    setOpen(false);
    if (notif.ideaId) navigate(`/ideas/${notif.ideaId}`);
  };

  const recent = messages.slice(0, 6);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* ── Bell button ─────────────────────────────────── */}
      <button
        className="main-topbar-notif"
        title="Notifications"
        onClick={() => setOpen((o) => !o)}
        style={{ position: 'relative' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            minWidth: 16, height: 16, borderRadius: 8,
            background: '#ef4444', color: '#fff',
            fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', lineHeight: 1,
            border: '2px solid var(--color-background-primary, #fff)',
            animation: 'notif-pulse 2s ease-in-out infinite',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown ─────────────────────────────────────── */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 320, maxHeight: 420,
          background: 'var(--color-background-primary, #fff)',
          border: '1px solid var(--color-border-tertiary, #e5e7eb)',
          borderRadius: 10, boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          zIndex: 1000, display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'notif-slideIn 0.2s ease-out',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px',
            borderBottom: '1px solid var(--color-border-tertiary, #e5e7eb)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-primary, #111)' }}>
                Thông báo
              </span>
              {unreadCount > 0 && (
                <span style={{
                  background: '#ef4444', color: '#fff',
                  fontSize: 9, fontWeight: 700, padding: '1px 5px',
                  borderRadius: 8, lineHeight: '14px',
                }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {unreadCount > 0 && (
                <button
                  onClick={() => dispatch(markAllAsReadAsync())}
                  style={{
                    fontSize: 11, color: '#2563eb', background: 'none',
                    border: 'none', cursor: 'pointer', padding: '2px 6px',
                    borderRadius: 4, fontWeight: 500,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(37,99,235,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Đọc tất cả
                </button>
              )}
              {messages.length > 0 && (
                <button
                  onClick={() => dispatch(clearNotifications())}
                  style={{
                    fontSize: 11, color: '#94a3b8', background: 'none',
                    border: 'none', cursor: 'pointer', padding: '2px 6px',
                    borderRadius: 4,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                  Xoá
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {messages.length === 0 ? (
              <div style={{
                padding: '32px 16px', textAlign: 'center',
                color: 'var(--color-text-secondary, #94a3b8)', fontSize: 12,
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
                  width="28" height="28" style={{ marginBottom: 6, opacity: 0.35 }}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <p style={{ margin: 0 }}>Chưa có thông báo</p>
              </div>
            ) : (
              recent.map((notif, idx) => (
                <button
                  key={notif.ideaId ? `${notif.ideaId}-${idx}` : idx}
                  onClick={() => handleClick(notif)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none',
                    border: 'none', cursor: 'pointer',
                    padding: '10px 14px',
                    borderBottom: idx < recent.length - 1 ? '1px solid var(--color-border-tertiary, #f1f5f9)' : 'none',
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    backgroundColor: notif.isRead ? 'transparent' : 'rgba(37,99,235,0.04)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background-secondary, #f8fafc)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.isRead ? 'transparent' : 'rgba(37,99,235,0.04)'}
                >
                  {/* Icon */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: notif.type === 'NEW_IDEA' ? '#eff6ff' : '#f0fdf4',
                    color: notif.type === 'NEW_IDEA' ? '#2563eb' : '#16a34a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <NotifIcon type={notif.type} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p style={{
                        margin: 0, fontSize: 12, fontWeight: notif.isRead ? 400 : 600,
                        color: 'var(--color-text-primary, #111)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        flex: 1,
                      }}>
                        {notif.title || 'Thông báo mới'}
                      </p>
                      <span style={{
                        fontSize: 10, color: 'var(--color-text-secondary, #94a3b8)',
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p style={{
                      margin: '2px 0 0', fontSize: 11,
                      color: 'var(--color-text-secondary, #64748b)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {notif.message}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notif.isRead && (
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#2563eb', flexShrink: 0, marginTop: 6,
                    }} />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer — view all link */}
          {messages.length > 0 && (
            <button
              onClick={() => {
                setOpen(false);
                const role = user?.role;
                if (role === 'QA_COORDINATOR') {
                  navigate('/coordinator/notifications');
                } else {
                  navigate('/notifications');
                }
              }}
              style={{
                padding: '8px 14px', textAlign: 'center',
                borderTop: '1px solid var(--color-border-tertiary, #e5e7eb)',
                background: 'none', border: 'none', borderTopWidth: 1,
                borderTopStyle: 'solid', borderTopColor: 'var(--color-border-tertiary, #e5e7eb)',
                cursor: 'pointer', fontSize: 11, fontWeight: 500,
                color: '#2563eb', width: '100%',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(37,99,235,0.04)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              Xem tất cả thông báo
            </button>
          )}
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes notif-slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes notif-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default NotificationDropdown;
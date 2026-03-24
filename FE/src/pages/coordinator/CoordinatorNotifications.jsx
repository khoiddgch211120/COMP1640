import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/coordinator.css"; // ← điều chỉnh path nếu cần

/* ── Mock notifications ──────────────────────────────────── */
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "idea",
    title: "Ý tưởng mới được nộp",
    desc: 'Nguyễn Văn A đã nộp ý tưởng "Cải thiện quy trình đánh giá học sinh" trong phòng ban của bạn.',
    time: "5 phút trước",
    read: false,
    ideaId: 1,
  },
  {
    id: 2,
    type: "idea",
    title: "Ý tưởng mới được nộp",
    desc: 'Trần Thị B đã nộp ý tưởng "Đề xuất phòng học thực hành mới" trong phòng ban của bạn.',
    time: "2 giờ trước",
    read: false,
    ideaId: 2,
  },
  {
    id: 3,
    type: "email",
    title: "Email thông báo đã gửi",
    desc: "Hệ thống đã tự động gửi email thông báo ý tưởng mới đến địa chỉ email của bạn.",
    time: "2 giờ trước",
    read: false,
    ideaId: null,
  },
  {
    id: 4,
    type: "idea",
    title: "Ý tưởng mới được nộp",
    desc: 'Lê Văn C đã nộp ý tưởng "Chương trình trao đổi sinh viên quốc tế".',
    time: "1 ngày trước",
    read: true,
    ideaId: 3,
  },
  {
    id: 5,
    type: "email",
    title: "Email thông báo đã gửi",
    desc: "Hệ thống đã tự động gửi email thông báo ý tưởng mới đến địa chỉ email của bạn.",
    time: "1 ngày trước",
    read: true,
    ideaId: null,
  },
  {
    id: 6,
    type: "idea",
    title: "Ý tưởng mới được nộp",
    desc: 'Phạm Thị D đã nộp ý tưởng "Hệ thống thông báo nội bộ tự động".',
    time: "3 ngày trước",
    read: true,
    ideaId: 4,
  },
  {
    id: 7,
    type: "idea",
    title: "Ý tưởng mới được nộp",
    desc: 'Hoàng Văn E đã nộp ý tưởng "Nâng cấp cơ sở hạ tầng mạng WiFi".',
    time: "5 ngày trước",
    read: true,
    ideaId: 5,
  },
  {
    id: 8,
    type: "email",
    title: "Email thông báo đã gửi",
    desc: "Hệ thống đã tự động gửi email thông báo ý tưởng mới đến địa chỉ email của bạn.",
    time: "5 ngày trước",
    read: true,
    ideaId: null,
  },
];

const FILTERS = [
  { key: "all",    label: "Tất cả"      },
  { key: "unread", label: "Chưa đọc"    },
  { key: "idea",   label: "Ý tưởng mới" },
  { key: "email",  label: "Email"        },
];

/* ── Icon components ────────────────────────────────────── */
const IdeaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
    <line x1="9" y1="21" x2="15" y2="21"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const CoordinatorNotifications = () => {
  const navigate   = useNavigate();
  const [filter, setFilter]     = useState("all");
  const [items, setItems]       = useState(MOCK_NOTIFICATIONS);

  const unreadCount = items.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    switch (filter) {
      case "unread": return items.filter((n) => !n.read);
      case "idea":   return items.filter((n) => n.type === "idea");
      case "email":  return items.filter((n) => n.type === "email");
      default:       return items;
    }
  }, [filter, items]);

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id) =>
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const handleClick = (notif) => {
    markRead(notif.id);
    if (notif.ideaId) navigate(`/ideas/${notif.ideaId}`);
  };

  return (
    <div className="co-page">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="co-page-header">
        <div>
          <h1 className="co-page-title">
            Thông báo
            {unreadCount > 0 && (
              <span style={{
                marginLeft: 10, fontSize: 13, fontWeight: 700,
                background: "#2563eb", color: "#fff",
                padding: "2px 9px", borderRadius: 20,
                verticalAlign: "middle",
              }}>
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="co-page-sub">Thông báo ý tưởng mới nộp trong department của bạn</p>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────── */}
      <div className="co-card">
        <div className="co-card-head" style={{ padding: "12px 16px" }}>
          <div className="co-notif-filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`co-filter-btn${filter === f.key ? " co-filter-btn--active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                {f.key === "unread" && unreadCount > 0 && (
                  <span style={{
                    marginLeft: 5, background: filter === "unread" ? "rgba(255,255,255,0.3)" : "#dbeafe",
                    color: filter === "unread" ? "#fff" : "#2563eb",
                    fontSize: 10, fontWeight: 700,
                    padding: "1px 6px", borderRadius: 20,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
            {unreadCount > 0 && (
              <button className="co-mark-all-btn" onClick={markAllRead}>
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>

        {/* ── Notification list ─────────────────────────────── */}
        <div className="co-notif-list">
          {filtered.length === 0 ? (
            <div className="co-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <p>Không có thông báo nào</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                className={`co-notif-item${!notif.read ? " co-notif-item--unread" : ""}`}
                onClick={() => handleClick(notif)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleClick(notif)}
              >
                {/* Icon */}
                <div className={`co-notif-icon co-notif-icon--${notif.type}`}>
                  {notif.type === "idea" ? <IdeaIcon /> : <EmailIcon />}
                </div>

                {/* Body */}
                <div className="co-notif-body">
                  <div className="co-notif-title">{notif.title}</div>
                  <div className="co-notif-desc">{notif.desc}</div>
                  <div className="co-notif-time">{notif.time}</div>
                </div>

                {/* Unread dot */}
                {!notif.read && <div className="co-notif-dot" />}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default CoordinatorNotifications;
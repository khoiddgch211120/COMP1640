import { useSelector } from "react-redux";
import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import "../../styles/coordinator.css"; // ← điều chỉnh path nếu cần

/* ── Mock data: ideas theo tháng (fallback khi Redux rỗng) ── */
const MOCK_MONTHLY = [
  { month: "Th8",  count: 3 },
  { month: "Th9",  count: 7 },
  { month: "Th10", count: 5 },
  { month: "Th11", count: 9 },
  { month: "Th12", count: 4 },
  { month: "Th1",  count: 11 },
];

const MOCK_IDEAS = [
  { id: 1, title: "Cải thiện quy trình đánh giá học sinh",   author: "Nguyễn Văn A", status: "approved",  comments: 4,  date: "15/01/2026" },
  { id: 2, title: "Đề xuất phòng học thực hành mới",         author: "Trần Thị B",   status: "pending",   comments: 2,  date: "18/01/2026" },
  { id: 3, title: "Chương trình trao đổi sinh viên quốc tế", author: "Lê Văn C",     status: "review",    comments: 6,  date: "20/01/2026" },
  { id: 4, title: "Hệ thống thông báo nội bộ tự động",       author: "Phạm Thị D",   status: "approved",  comments: 3,  date: "22/01/2026" },
  { id: 5, title: "Nâng cấp cơ sở hạ tầng mạng WiFi",       author: "Hoàng Văn E",  status: "rejected",  comments: 1,  date: "24/01/2026" },
];

const MOCK_CATEGORIES = [
  { name: "Cơ sở vật chất",   count: 8 },
  { name: "Học thuật",        count: 12 },
  { name: "Công nghệ",        count: 6 },
  { name: "Nhân sự",          count: 4 },
  { name: "Sinh viên",        count: 9 },
];

const STATUS_MAP = {
  approved: { label: "Đã duyệt",   cls: "co-badge--approved" },
  pending:  { label: "Chờ duyệt",  cls: "co-badge--pending"  },
  review:   { label: "Đang xem",   cls: "co-badge--review"   },
  rejected: { label: "Từ chối",    cls: "co-badge--rejected" },
};

/* ── Custom Tooltip cho chart ──────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0",
      borderRadius: 8, padding: "8px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.09)",
      fontSize: 13,
    }}>
      <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{label}</p>
      <p style={{ margin: "3px 0 0", color: "#2563eb" }}>{payload[0].value} ý tưởng</p>
    </div>
  );
};

const CoordinatorDashboard = () => {
  const reduxIdeas = useSelector((state) => state.ideas?.ideas ?? []);
  const user       = useSelector((state) => state.auth.user);

  /* ── Filter by department ────────────────────────────────── */
  const deptIdeas = useMemo(() => {
    if (!user || reduxIdeas.length === 0) return null; // null = dùng mock
    return reduxIdeas.filter((i) => i.dept_id === user.dept_id);
  }, [reduxIdeas, user]);

  const ideas     = deptIdeas ?? MOCK_IDEAS;
  const allIdeas  = reduxIdeas.length > 0 ? reduxIdeas : MOCK_IDEAS;

  /* ── Stats ───────────────────────────────────────────────── */
  const totalIdeas        = ideas.length;
  const totalComments     = ideas.reduce((s, i) => s + (i.comments?.length ?? i.comments ?? 0), 0);
  const totalContributors = new Set(ideas.map((i) => i.author?.id ?? i.author)).size;
  const contribution      = allIdeas.length > 0
    ? ((totalIdeas / allIdeas.length) * 100).toFixed(1)
    : 0;

  const approvedCount = ideas.filter((i) => i.status === "approved").length;
  const pendingCount  = ideas.filter((i) => i.status === "pending" || i.status === "review").length;

  /* ── Build monthly data from real ideas or use mock ────── */
  const monthlyData = useMemo(() => {
    if (deptIdeas === null) return MOCK_MONTHLY;
    // Nếu có real data, group theo tháng
    const map = {};
    deptIdeas.forEach((idea) => {
      const d = new Date(idea.created_at || idea.date || Date.now());
      const key = `Th${d.getMonth() + 1}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  }, [deptIdeas]);

  const deptName = user?.department || user?.dept_name || "IT";

  return (
    <div className="co-page">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="co-page-header">
        <div>
          <h1 className="co-page-title">Dashboard — Phòng {deptName}</h1>
          <p className="co-page-sub">Tổng quan ý tưởng trong phạm vi department của bạn</p>
        </div>
        <span style={{
          fontSize: 12, color: "#64748b",
          background: "#f1f5f9", padding: "5px 12px",
          borderRadius: 8, border: "1px solid #e2e8f0",
        }}>
          Năm học 2025 – 2026
        </span>
      </div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      <div className="co-stats-grid">

        <div className="co-stat-card">
          <div className="co-stat-head">
            <span className="co-stat-label">Tổng ý tưởng</span>
            <span className="co-stat-icon co-stat-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
                <line x1="9" y1="21" x2="15" y2="21"/><line x1="10" y1="19" x2="14" y2="19"/>
              </svg>
            </span>
          </div>
          <div className="co-stat-value">{totalIdeas}</div>
          <div className="co-stat-footer">
            <span className="co-stat-badge co-stat-badge--up">↑ {approvedCount} đã duyệt</span>
            <span>{pendingCount} chờ xử lý</span>
          </div>
        </div>

        <div className="co-stat-card">
          <div className="co-stat-head">
            <span className="co-stat-label">Người đóng góp</span>
            <span className="co-stat-icon co-stat-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
          </div>
          <div className="co-stat-value">{totalContributors}</div>
          <div className="co-stat-footer">Staff trong phòng ban</div>
        </div>

        <div className="co-stat-card">
          <div className="co-stat-head">
            <span className="co-stat-label">Bình luận</span>
            <span className="co-stat-icon co-stat-icon--amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </span>
          </div>
          <div className="co-stat-value">{totalComments}</div>
          <div className="co-stat-footer">Trên tất cả ý tưởng</div>
        </div>

        <div className="co-stat-card">
          <div className="co-stat-head">
            <span className="co-stat-label">Đóng góp</span>
            <span className="co-stat-icon co-stat-icon--purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </span>
          </div>
          <div className="co-stat-value">{contribution}%</div>
          <div className="co-stat-footer">So với toàn trường</div>
          <div className="co-progress-wrap">
            <div className="co-progress-bar" style={{ width: `${Math.min(contribution, 100)}%` }} />
          </div>
        </div>

      </div>

      {/* ── Chart + Category ────────────────────────────────── */}
      <div className="co-row">

        {/* Bar chart */}
        <div className="co-card">
          <div className="co-card-head">
            <span className="co-card-title">Ý tưởng theo tháng</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>6 tháng gần nhất</span>
          </div>
          <div className="co-chart-wrap" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barSize={28}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f0f7ff" }} />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="co-card">
          <div className="co-card-head">
            <span className="co-card-title">Theo danh mục</span>
          </div>
          <div className="co-category-list">
            {MOCK_CATEGORIES.map((cat) => (
              <div key={cat.name} className="co-category-item">
                <span className="co-category-name">{cat.name}</span>
                <span className="co-category-count">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Recent ideas table ──────────────────────────────── */}
      <div className="co-card">
        <div className="co-card-head">
          <span className="co-card-title">Ý tưởng gần đây</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>5 ý tưởng mới nhất</span>
        </div>
        <div className="co-card-body" style={{ overflowX: "auto" }}>
          <table className="co-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Ngày nộp</th>
                <th>Bình luận</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {(deptIdeas?.slice(0, 5) ?? MOCK_IDEAS).map((idea) => {
                const status = STATUS_MAP[idea.status] ?? STATUS_MAP.pending;
                const author = idea.author?.name ?? idea.author ?? "—";
                const date   = idea.created_at
                  ? new Date(idea.created_at).toLocaleDateString("vi-VN")
                  : idea.date ?? "—";
                const cmtCount = Array.isArray(idea.comments)
                  ? idea.comments.length
                  : (idea.comments ?? 0);
                return (
                  <tr key={idea.id}>
                    <td style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: "#0f172a" }}>
                      {idea.title}
                    </td>
                    <td>{author}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{date}</td>
                    <td>{cmtCount}</td>
                    <td>
                      <span className={`co-badge ${status.cls}`}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CoordinatorDashboard;
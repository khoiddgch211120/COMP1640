import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import "../../styles/ideas.css"; // ← điều chỉnh path nếu cần

/* ── Mock fallback data ─────────────────────────────────── */
const MOCK_IDEAS = [
  { id: "1", title: "Improving the Student Assessment Process", description: "Proposing a continuous assessment system instead of relying solely on final exams.", author: { id: "u1", name: "John Nguyen" }, isAnonymous: false, category: "Academic", views: 142, upvotes: ["u2","u3","u4"], downvotes: ["u5"], comments: [{id:"c1"},{id:"c2"},{id:"c3"}], createdAt: "2026-01-15", dept_id: "IT" },
  { id: "2", title: "New Practical Learning Room Proposal", description: "Building modern lab rooms with updated equipment for a better student learning environment.", author: { id: "u2", name: "Jane Smith" }, isAnonymous: false, category: "Facilities", views: 98, upvotes: ["u1","u3"], downvotes: [], comments: [{id:"c4"},{id:"c5"}], createdAt: "2026-01-18", dept_id: "IT" },
  { id: "3", title: "International Student Exchange Program", description: "Partnering with universities in Europe and Asia to expand learning opportunities for students.", author: { id: "u3", name: "Robert Lee" }, isAnonymous: true, category: "Academic", views: 211, upvotes: ["u1","u2","u4","u5"], downvotes: ["u6"], comments: [{id:"c6"},{id:"c7"},{id:"c8"},{id:"c9"},{id:"c10"},{id:"c11"}], createdAt: "2026-01-20", dept_id: "IT" },
  { id: "4", title: "Automated Internal Notification System", description: "Deploying a mobile app to send real-time notifications to all staff instead of traditional email.", author: { id: "u4", name: "Diana Pham" }, isAnonymous: false, category: "Technology", views: 77, upvotes: ["u2","u3"], downvotes: ["u1","u5"], comments: [{id:"c12"},{id:"c13"}], createdAt: "2026-01-22", dept_id: "IT" },
  { id: "5", title: "Campus-Wide WiFi Upgrade", description: "Investing in WiFi 6 equipment to ensure stable connectivity for over 5,000 simultaneous users.", author: { id: "u5", name: "Edward Hoang" }, isAnonymous: false, category: "Technology", views: 63, upvotes: ["u1"], downvotes: ["u2","u3","u4"], comments: [{id:"c14"}], createdAt: "2026-01-24", dept_id: "IT" },
  { id: "6", title: "Internal Mentorship Program", description: "Connecting senior staff with junior colleagues to share knowledge and experience, fostering a learning culture.", author: { id: "u6", name: "Fiona Vu" }, isAnonymous: false, category: "Human Resources", views: 134, upvotes: ["u1","u2","u3","u4","u5"], downvotes: [], comments: [{id:"c15"},{id:"c16"},{id:"c17"}], createdAt: "2026-01-26", dept_id: "IT" },
];

const FILTERS = [
  { key: "latest",  label: "Latest"     },
  { key: "popular", label: "Most Popular" },
  { key: "views",   label: "Most Viewed"},
];

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IdeaList = () => {
  const reduxIdeas = useSelector((state) => state.ideas?.ideas ?? []);
  const user       = useSelector((state) => state.auth.user);
  const navigate   = useNavigate();

  const ideas = reduxIdeas.length > 0 ? reduxIdeas : MOCK_IDEAS;

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter]           = useState("latest");
  const ideasPerPage = 6;

  /* ── Filter by dept for coordinator ────────────────────── */
  const deptIdeas = useMemo(() => {
    if (user?.role === ROLES.QA_COORDINATOR) {
      return ideas.filter((i) => i.dept_id === user.dept_id);
    }
    return ideas;
  }, [ideas, user]);

  /* ── Sort ───────────────────────────────────────────────── */
  const sorted = useMemo(() => {
    const arr = [...deptIdeas];
    if (filter === "popular") arr.sort((a, b) => (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length));
    if (filter === "views")   arr.sort((a, b) => b.views - a.views);
    if (filter === "latest")  arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return arr;
  }, [deptIdeas, filter]);

  /* ── Pagination ─────────────────────────────────────────── */
  const totalPages   = Math.ceil(sorted.length / ideasPerPage);
  const currentIdeas = sorted.slice((currentPage - 1) * ideasPerPage, currentPage * ideasPerPage);

  /* ── Stats ───────────────────────────────────────────────── */
  const maxViews = deptIdeas.length > 0 ? Math.max(...deptIdeas.map((i) => i.views)) : 0;
  const maxScore = deptIdeas.length > 0 ? Math.max(...deptIdeas.map((i) => i.upvotes.length - i.downvotes.length)) : 0;

  const scoreClass = (idea) => {
    const s = idea.upvotes.length - idea.downvotes.length;
    if (s > 0) return "id-score--pos";
    if (s < 0) return "id-score--neg";
    return "id-score--neu";
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-GB") : "";

  return (
    <div className="id-page">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="id-page-header">
        <div>
          <h1 className="id-page-title">Idea List</h1>
          <p className="id-page-sub">Explore and manage submitted ideas</p>
        </div>
        {user?.role === ROLES.STAFF && (
          <Link to="/submit-idea" className="id-btn id-btn--primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Submit Idea
          </Link>
        )}
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="id-stats-row">
        <div className="id-stat-card">
          <div className="id-stat-icon id-stat-icon--blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
              <line x1="9" y1="21" x2="15" y2="21"/>
            </svg>
          </div>
          <div className="id-stat-body">
            <div className="id-stat-label">Total Ideas</div>
            <div className="id-stat-value">{deptIdeas.length}</div>
          </div>
        </div>

        <div className="id-stat-card">
          <div className="id-stat-icon id-stat-icon--green">
            <EyeIcon />
          </div>
          <div className="id-stat-body">
            <div className="id-stat-label">Most Viewed</div>
            <div className="id-stat-value">{maxViews}</div>
          </div>
        </div>

        <div className="id-stat-card">
          <div className="id-stat-icon id-stat-icon--purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div className="id-stat-body">
            <div className="id-stat-label">Highest Score</div>
            <div className="id-stat-value">{maxScore > 0 ? `+${maxScore}` : maxScore}</div>
          </div>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────── */}
      <div className="id-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`id-filter-btn${filter === f.key ? " id-filter-btn--active" : ""}`}
            onClick={() => { setFilter(f.key); setCurrentPage(1); }}
          >
            {f.label}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8", alignSelf: "center" }}>
          {deptIdeas.length} ideas
        </span>
      </div>

      {/* ── Empty ──────────────────────────────────────────── */}
      {currentIdeas.length === 0 && (
        <div className="id-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
          </svg>
          <p className="id-empty-title">No ideas yet</p>
          <p className="id-empty-sub">Be the first to submit an idea!</p>
        </div>
      )}

      {/* ── Grid ───────────────────────────────────────────── */}
      <div className="id-grid">
        {currentIdeas.map((idea) => {
          const score     = idea.upvotes.length - idea.downvotes.length;
          const scoreSign = score > 0 ? `+${score}` : `${score}`;
          const author    = idea.isAnonymous ? "Anonymous" : (idea.author?.name ?? idea.author ?? "—");
          const initial   = idea.isAnonymous ? "?" : (author[0] ?? "?").toUpperCase();

          return (
            <div key={idea.id} className="id-idea-card" onClick={() => navigate(`/ideas/${idea.id}`)}>
              {idea.category && (
                <span className="id-idea-category">{idea.category}</span>
              )}

              <Link
                to={`/ideas/${idea.id}`}
                className="id-idea-title"
                onClick={(e) => e.stopPropagation()}
              >
                {idea.title}
              </Link>

              <div className="id-idea-author">
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: idea.isAnonymous ? "#94a3b8" : "#2563eb",
                  color: "#fff", fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {initial}
                </div>
                {author} · {formatDate(idea.createdAt)}
              </div>

              <div className="id-idea-footer">
                <div className="id-idea-meta">
                  <span className="id-idea-meta-item"><EyeIcon /> {idea.views}</span>
                  <span className="id-idea-meta-item"><ChatIcon /> {Array.isArray(idea.comments) ? idea.comments.length : 0}</span>
                </div>
                <span className={`id-score ${scoreClass(idea)}`}>
                  {score >= 0 ? "▲" : "▼"} {scoreSign}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pagination ─────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="id-pagination">
          <button
            className="id-page-btn id-page-btn--nav"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`id-page-btn${currentPage === i + 1 ? " id-page-btn--active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="id-page-btn id-page-btn--nav"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
};

export default IdeaList;
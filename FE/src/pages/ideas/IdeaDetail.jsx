import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementView,
  toggleVote,
  addComment,
} from "../../redux/slices/ideaSlice";
import { ROLES } from "../../constants/roles";
import "../../styles/ideas.css"; // ← điều chỉnh path nếu cần

/* ── Mock fallback ──────────────────────────────────────── */
const MOCK_IDEA = {
  id: "1",
  title: "Cải thiện quy trình đánh giá học sinh",
  description: "Đề xuất áp dụng hệ thống đánh giá liên tục thay vì chỉ dựa vào thi cuối kỳ, giúp phản ánh đúng năng lực học sinh. Hệ thống này bao gồm đánh giá theo quá trình, bài tập nhóm, thuyết trình và kiểm tra ngắn định kỳ. Điều này không chỉ giảm áp lực thi cử mà còn giúp giáo viên theo dõi tiến độ học tập của từng em một cách sát sao hơn.",
  author: { id: "u1", name: "Nguyễn Văn A" },
  isAnonymous: false,
  category: "Học thuật",
  views: 142,
  upvotes: ["u2", "u3", "u4"],
  downvotes: ["u5"],
  attachments: [
    { id: "a1", name: "proposal.pdf",   url: "#" },
    { id: "a2", name: "research.docx",  url: "#" },
  ],
  comments: [
    { id: "c1", name: "Trần Thị B",   content: "Ý tưởng rất hay! Tôi đã thấy mô hình này hiệu quả ở nhiều trường quốc tế.", isAnonymous: false, createdAt: "2026-01-16T10:00:00" },
    { id: "c2", name: "Ẩn danh",       content: "Cần xem xét thêm về nguồn lực giáo viên và thời gian triển khai.", isAnonymous: true,  createdAt: "2026-01-17T14:30:00" },
    { id: "c3", name: "Lê Văn C",      content: "Tôi ủng hộ! Có thể thí điểm ở một vài lớp trước không?", isAnonymous: false, createdAt: "2026-01-18T09:15:00" },
  ],
  createdAt: "2026-01-15",
};

const IdeaDetail = () => {
  const { id }       = useParams();
  const dispatch     = useDispatch();
  const navigate     = useNavigate();

  const { user }               = useSelector((state) => state.auth);
  const { currentAcademicYear } = useSelector((state) => state.academicYear ?? {});

  const reduxIdea = useSelector((state) =>
    state.ideas?.ideas?.find((i) => i.id === id)
  );

  const idea = reduxIdea ?? MOCK_IDEA;

  const [commentText,   setCommentText]   = useState("");
  const [isAnonymousCmt, setAnonymousCmt] = useState(false);

  /* ── Increment view ─────────────────────────────────────── */
  useEffect(() => {
    if (reduxIdea) dispatch(incrementView(id));
  }, [id, dispatch]);

  if (!idea) {
    return (
      <div className="id-page">
        <div className="id-access-denied">Không tìm thấy ý tưởng này.</div>
      </div>
    );
  }

  /* ── Derived values ─────────────────────────────────────── */
  const score        = idea.upvotes.length - idea.downvotes.length;
  const scoreSign    = score > 0 ? `+${score}` : `${score}`;
  const scoreCls     = score > 0 ? "id-score--pos" : score < 0 ? "id-score--neg" : "id-score--neu";
  const commentClosed = currentAcademicYear && new Date() > new Date(currentAcademicYear.finalClosureDate);
  const authorName   = idea.isAnonymous ? "Ẩn danh" : (idea.author?.name ?? "—");
  const authorInitial = idea.isAnonymous ? "?" : (authorName[0] ?? "?").toUpperCase();

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatDateTime = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  /* ── Handlers ───────────────────────────────────────────── */
  const handleVote = (type) => {
    if (!user || user.role !== ROLES.STAFF) return;
    if (idea.author?.id === user.id) { alert("Bạn không thể vote ý tưởng của mình"); return; }
    dispatch(toggleVote({ ideaId: id, userId: user.id, type }));
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    if (commentClosed) { alert("Thời gian bình luận đã đóng"); return; }
    dispatch(addComment({
      ideaId: id,
      comment: {
        userId:      user.id,
        name:        isAnonymousCmt ? "Ẩn danh" : user.fullName,
        content:     commentText,
        isAnonymous: isAnonymousCmt,
        createdAt:   new Date().toISOString(),
      },
    }));
    setCommentText("");
  };

  const canComment = user?.role === ROLES.STAFF || user?.role === ROLES.QA_COORDINATOR;
  const canVote    = user?.role === ROLES.STAFF;

  const sortedComments = [...idea.comments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="id-page">

      {/* ── Back button ────────────────────────────────────── */}
      <div>
        <button className="id-btn id-btn--ghost" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Quay lại
        </button>
      </div>

      {/* ── Hero card ──────────────────────────────────────── */}
      <div className="id-detail-hero">

        <div className="id-detail-hero-top">

          {/* Badges */}
          <div className="id-detail-badges">
            {idea.category && (
              <span className="id-detail-category">{idea.category}</span>
            )}
            {idea.isAnonymous && (
              <span className="id-detail-anon">Ẩn danh</span>
            )}
            <span className={`id-score ${scoreCls}`} style={{ marginLeft: "auto" }}>
              {score >= 0 ? "▲" : "▼"} {scoreSign}
            </span>
          </div>

          {/* Title */}
          <h1 className="id-detail-title">{idea.title}</h1>

          {/* Author */}
          <div className="id-detail-author-row">
            <div className="id-detail-avatar"
              style={{ background: idea.isAnonymous ? "#94a3b8" : "#2563eb" }}>
              {authorInitial}
            </div>
            <div>
              <div className="id-detail-author-name">{authorName}</div>
              <div className="id-detail-author-date">{formatDate(idea.createdAt)}</div>
            </div>
          </div>

        </div>

        {/* Description */}
        <div className="id-detail-desc">{idea.description}</div>

        {/* Attachments */}
        {idea.attachments?.length > 0 && (
          <div className="id-detail-attachments">
            <div className="id-attachment-label">Tệp đính kèm</div>
            {idea.attachments.map((f) => (
              <a key={f.id} href={f.url} download className="id-attachment-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                {f.name}
              </a>
            ))}
          </div>
        )}

        {/* Stat bar + vote */}
        <div className="id-detail-stat-bar">
          <div className="id-detail-meta">
            <span className="id-detail-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {idea.views} lượt xem
            </span>
            <span className="id-detail-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {idea.comments.length} bình luận
            </span>
          </div>

          {canVote && (
            <div className="id-vote-group">
              <button className="id-vote-btn id-vote-btn--up" onClick={() => handleVote("up")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
                Upvote · {idea.upvotes.length}
              </button>
              <button className="id-vote-btn id-vote-btn--down" onClick={() => handleVote("down")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
                Downvote · {idea.downvotes.length}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ── Comments ───────────────────────────────────────── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>
            Bình luận
            <span style={{
              marginLeft: 8, fontSize: 12, background: "#e2e8f0", color: "#475569",
              padding: "2px 8px", borderRadius: 20, fontWeight: 600,
            }}>
              {idea.comments.length}
            </span>
          </h3>
          {commentClosed && (
            <div className="id-closed-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Thời gian bình luận đã đóng
            </div>
          )}
        </div>

        {/* Comment box */}
        {canComment && !commentClosed && (
          <div className="id-composer" style={{ marginBottom: 16 }}>
            <div className="id-composer-title">Thêm bình luận</div>
            <textarea
              className="id-composer-textarea"
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Chia sẻ suy nghĩ của bạn..."
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#64748b", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isAnonymousCmt}
                  onChange={(e) => setAnonymousCmt(e.target.checked)}
                  style={{ accentColor: "#2563eb", width: 13, height: 13 }}
                />
                Bình luận ẩn danh
              </label>
              <button
                className="id-btn id-btn--primary"
                onClick={handleComment}
                disabled={!commentText.trim()}
                style={{ opacity: commentText.trim() ? 1 : 0.5 }}
              >
                Gửi bình luận
              </button>
            </div>
          </div>
        )}

        {/* Comment list */}
        {sortedComments.length === 0 ? (
          <div className="id-empty" style={{ padding: "40px 20px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p className="id-empty-sub">Chưa có bình luận nào.</p>
          </div>
        ) : (
          <div className="id-comments-section">
            {sortedComments.map((c) => {
              const name    = c.isAnonymous ? "Ẩn danh" : c.name;
              const initial = c.isAnonymous ? "?" : (name[0] ?? "?").toUpperCase();
              return (
                <div key={c.id} className="id-comment-item">
                  <div className="id-comment-header">
                    <div className="id-comment-avatar"
                      style={{ background: c.isAnonymous ? "#94a3b8" : "#2563eb" }}>
                      {initial}
                    </div>
                    <div className="id-comment-author">{name}</div>
                    <div className="id-comment-time">{formatDateTime(c.createdAt)}</div>
                  </div>
                  <div className="id-comment-body">{c.content}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default IdeaDetail;
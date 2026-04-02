import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestComments } from "../../services/commentService";

const LatestComments = () => {
  const navigate = useNavigate();

  const [comments,   setComments]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [page,       setPage]       = useState(0);       // 0-based (BE)
  const [totalPages, setTotalPages] = useState(0);

  const PAGE_SIZE = 10;

  const fetchComments = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLatestComments(p, PAGE_SIZE);
      setComments(data?.content ?? []);
      setTotalPages(data?.totalPages ?? 0);
    } catch (err) {
      setError("Failed to load comments.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComments(page); }, [page, fetchComments]);

  const formatDateTime = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div style={{ padding: "24px", maxWidth: 800 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#0f172a" }}>
        Latest Comments
      </h1>
      <p style={{ color: "#64748b", marginBottom: 20, fontSize: 14 }}>
        Most recent comments across all ideas
      </p>

      {loading && (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#64748b" }}>
          Loading comments...
        </div>
      )}

      {error && !loading && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
          padding: "12px 16px", color: "#dc2626", marginBottom: 16,
        }}>
          {error}
          <button
            onClick={() => fetchComments(page)}
            style={{ marginLeft: 10, textDecoration: "underline", cursor: "pointer",
              background: "none", border: "none", color: "#dc2626" }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && comments.length === 0 && (
        <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px 0" }}>
          No comments available
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {comments.map((c) => {
          const author  = c.isAnonymous ? "Anonymous" : (c.authorName ?? "—");
          const initial = c.isAnonymous ? "?" : (author[0] ?? "?").toUpperCase();
          return (
            <div
              key={c.commentId}
              style={{
                border: "1px solid #e2e8f0", borderRadius: 10,
                padding: "14px 16px", background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                cursor: c.ideaId ? "pointer" : "default",
              }}
              onClick={() => c.ideaId && navigate(`/ideas/${c.ideaId}`)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: c.isAnonymous ? "#94a3b8" : "#2563eb",
                  color: "#fff", fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {initial}
                </div>
                <span style={{ fontWeight: 600, fontSize: 13.5, color: "#0f172a" }}>
                  {author}
                </span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8" }}>
                  {formatDateTime(c.createdAt)}
                </span>
              </div>

              <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.6 }}>
                {c.content}
              </p>

              {c.ideaId && (
                <p style={{
                  margin: "8px 0 0", fontSize: 12, color: "#94a3b8",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12">
                    <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
                  </svg>
                  Idea #{c.ideaId}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Pagination ─────────────────────────────────────── */}
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            style={{
              padding: "6px 14px", borderRadius: 6, border: "1px solid #e2e8f0",
              background: "#fff", cursor: page === 0 ? "not-allowed" : "pointer",
              opacity: page === 0 ? 0.4 : 1, fontSize: 13,
            }}
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                padding: "6px 12px", borderRadius: 6, fontSize: 13,
                border: `1px solid ${page === i ? "#2563eb" : "#e2e8f0"}`,
                background: page === i ? "#2563eb" : "#fff",
                color: page === i ? "#fff" : "#374151",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1}
            style={{
              padding: "6px 14px", borderRadius: 6, border: "1px solid #e2e8f0",
              background: "#fff", cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
              opacity: page === totalPages - 1 ? 0.4 : 1, fontSize: 13,
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestComments;
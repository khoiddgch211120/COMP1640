import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { getAllIdeas } from "../../services/ideaService";
import { getCurrentAcademicYear } from "../../services/academicYearService";
import "../../styles/coordinator.css";


const svcGetCurrentAcademicYear = getCurrentAcademicYear;
const svcGetAllIdeas            = getAllIdeas;

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0",
      borderRadius: 8, padding: "8px 14px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.09)", fontSize: 13,
    }}>
      <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{label}</p>
      <p style={{ margin: "3px 0 0", color: "#2563eb" }}>{payload[0].value} ideas</p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const CoordinatorDashboard = () => {
  const user = useSelector((state) => state.auth.user);

  const [ideas,       setIdeas]       = useState([]);
  const [currentYear, setCurrentYear] = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [year, ideasData] = await Promise.all([
          svcGetCurrentAcademicYear(),
          // QA_COORDINATOR can only view ideas in their own department
          // Pass deptId as a param so BE filters accordingly
          svcGetAllIdeas({
            deptId: user?.deptId,
            size: 100,
          }),
        ]);
        setCurrentYear(year);
        setIdeas(ideasData?.content ?? []);
      } catch (err) {
        console.error("CoordinatorDashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  /* ── Stats ── */
  const totalIdeas        = ideas.length;
  const totalContributors = new Set(ideas.map((i) => i.authorId).filter(Boolean)).size;
  const anonymousCount    = ideas.filter((i) => i.isAnonymous).length;

  /* ── Monthly trend ── */
  const monthlyData = (() => {
    const map = {};
    ideas.forEach((idea) => {
      if (!idea.submittedAt) return;
      const d   = new Date(idea.submittedAt);
      const key = `T${d.getMonth() + 1}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .map(([month, count]) => ({ month, count }))
      .slice(-6);
  })();

  /* ── Recent 5 ideas ── */
  const recentIdeas = [...ideas]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);

  const deptName  = user?.deptName || "Department";
  const yearLabel = currentYear?.yearLabel || "N/A";
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-GB") : "—";

  return (
    <div className="co-page">
      {/* ── Header ── */}
      <div className="co-page-header">
        <div>
          <h1 className="co-page-title">
            Dashboard — {deptName}
          </h1>
          <p className="co-page-sub">Overview of ideas within your department</p>
        </div>
        <span style={{
          fontSize: 12, color: "#64748b", background: "#f1f5f9",
          padding: "5px 12px", borderRadius: 8, border: "1px solid #e2e8f0",
        }}>
          {yearLabel}
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
          Loading data...
        </div>
      ) : (
        <>
          {/* ── Stat cards ── */}
          <div className="co-stats-grid">
            <div className="co-stat-card">
              <div className="co-stat-head">
                <span className="co-stat-label">Total Ideas</span>
                <span className="co-stat-icon co-stat-icon--blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
                    <line x1="9" y1="21" x2="15" y2="21"/>
                  </svg>
                </span>
              </div>
              <div className="co-stat-value">{totalIdeas}</div>
              <div className="co-stat-footer">In department</div>
            </div>

            <div className="co-stat-card">
              <div className="co-stat-head">
                <span className="co-stat-label">Contributors</span>
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
              <div className="co-stat-footer">Staff who submitted ideas</div>
            </div>

            <div className="co-stat-card">
              <div className="co-stat-head">
                <span className="co-stat-label">Anonymous</span>
                <span className="co-stat-icon co-stat-icon--amber">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </span>
              </div>
              <div className="co-stat-value">{anonymousCount}</div>
              <div className="co-stat-footer">Anonymous ideas</div>
            </div>

            <div className="co-stat-card">
              <div className="co-stat-head">
                <span className="co-stat-label">Academic Year</span>
                <span className="co-stat-icon co-stat-icon--purple">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </span>
              </div>
              <div className="co-stat-value" style={{ fontSize: 16 }}>{yearLabel}</div>
              <div className="co-stat-footer">
                {currentYear?.ideaOpen ? "✅ Open" : "🔒 Closed"}
              </div>
            </div>
          </div>

          {/* ── Chart + top contributors ── */}
          <div className="co-row">
            <div className="co-card">
              <div className="co-card-head">
                <span className="co-card-title">Ideas by Month</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{monthlyData.length} months</span>
              </div>
              {monthlyData.length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8" }}>
                  No data available
                </div>
              ) : (
                <div className="co-chart-wrap" style={{ height: 250, minWidth: 0 }}>
                  <ResponsiveContainer width="100%" height={220}>
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
              )}
            </div>

            <div className="co-card">
              <div className="co-card-head">
                <span className="co-card-title">Top Contributors</span>
              </div>
              <div className="co-category-list">
                {(() => {
                  const countMap = {};
                  ideas.forEach((i) => {
                    if (i.isAnonymous || !i.authorName) return;
                    countMap[i.authorName] = (countMap[i.authorName] || 0) + 1;
                  });
                  return Object.entries(countMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([name, count]) => (
                      <div key={name} className="co-category-item">
                        <span className="co-category-name">{name}</span>
                        <span className="co-category-count">{count} ideas</span>
                      </div>
                    ));
                })()}
                {ideas.filter((i) => !i.isAnonymous).length === 0 && (
                  <div style={{ color: "#94a3b8", fontSize: 13, padding: "12px 0" }}>
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Recent ideas table ── */}
          <div className="co-card">
            <div className="co-card-head">
              <span className="co-card-title">Recent Ideas</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>5 latest ideas</span>
            </div>
            <div className="co-card-body" style={{ overflowX: "auto" }}>
              {recentIdeas.length === 0 ? (
                <div style={{ padding: "32px 0", textAlign: "center", color: "#94a3b8" }}>
                  No ideas yet
                </div>
              ) : (
                <table className="co-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Submitted</th>
                      <th>Upvotes</th>
                      <th>Downvotes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentIdeas.map((idea) => (
                      <tr key={idea.ideaId}>
                        <td style={{
                          maxWidth: 260, overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap",
                          fontWeight: 500, color: "#0f172a",
                        }}>
                          {idea.title}
                        </td>
                        {/* QA_COORDINATOR must not see anonymous identities */}
                        <td>{idea.isAnonymous ? "Anonymous" : (idea.authorName ?? "—")}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{formatDate(idea.submittedAt)}</td>
                        <td>{idea.upvotes ?? 0}</td>
                        <td>{idea.downvotes ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoordinatorDashboard;
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addIdea } from "../../redux/slices/ideaSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import "../../styles/ideas.css";       // ← điều chỉnh path nếu cần
import "../../styles/terms-modal.css"; // ← điều chỉnh path nếu cần

const CATEGORIES = [
  "Academic",
  "Facilities",
  "Technology",
  "Human Resources",
  "Students",
  "Other",
];

/* ── Terms gate modal ─────────────────────────────────────── */
const TermsGateModal = ({ onConfirm }) => (
  <div className="tg-backdrop">
    <div className="tg-box" role="alertdialog" aria-modal="true">

      {/* Icon */}
      <div className="tg-icon-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>

      {/* Content */}
      <h2 className="tg-title">Terms &amp; Conditions Required</h2>
      <p className="tg-desc">
        You must read and agree to the{" "}
        <strong>Terms &amp; Conditions</strong> before submitting an idea.
        <br />
        Please review and accept them to continue.
      </p>

      {/* Action */}
      <button className="tg-btn-ok" onClick={onConfirm}>
        OK — Go to Terms &amp; Conditions
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>

    </div>
  </div>
);

/* ── Main component ───────────────────────────────────────── */
const SubmitIdea = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user                    = useSelector((state) => state.auth.user);
  const { currentAcademicYear } = useSelector((state) => state.academicYear ?? {});

  const [form, setForm] = useState({
    title:       "",
    description: "",
    category:    "",
    isAnonymous: false,
  });
  const [charCount,   setCharCount]   = useState(0);
  const [showTermsGate, setShowTermsGate] = useState(false);

  /* ── Check terms on mount ───────────────────────────────── */
  useEffect(() => {
    const accepted = localStorage.getItem("acceptedTerms");
    if (!accepted) {
      setShowTermsGate(true);
    }
  }, []);

  /* ── Closure check ───────────────────────────────────────── */
  const isClosed = currentAcademicYear && new Date() > new Date(currentAcademicYear.closureDate);

  /* ── Access guard ────────────────────────────────────────── */
  if (!user || user.role !== ROLES.STAFF) {
    return (
      <div className="id-page">
        <div className="id-access-denied">🚫 You do not have permission to access this page.</div>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="id-page">
        <div style={{
          background: "#fef9c3", border: "1px solid #fde68a",
          borderRadius: 12, padding: 28, textAlign: "center",
          color: "#854d0e", fontWeight: 600, fontSize: 15,
        }}>
          ⏰ The submission period has ended.
        </div>
      </div>
    );
  }

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Double-check terms (edge case: localStorage cleared after mount)
    if (!localStorage.getItem("acceptedTerms")) {
      setShowTermsGate(true);
      return;
    }

    if (!form.title.trim() || !form.description.trim()) {
      alert("Title and description are required!");
      return;
    }

    dispatch(addIdea({
      title:          form.title,
      description:    form.description,
      category:       form.category,
      isAnonymous:    form.isAnonymous,
      author:         { id: user.id, name: user.fullName, department: user.department },
      academicYearId: currentAcademicYear?.id,
    }));

    navigate("/ideas");
  };

  const handleDescChange = (e) => {
    setForm({ ...form, description: e.target.value });
    setCharCount(e.target.value.length);
  };

  const yearName    = currentAcademicYear?.name || "Not set";
  const closureDate = currentAcademicYear?.closureDate
    ? new Date(currentAcademicYear.closureDate).toLocaleDateString("en-GB") : "—";
  const finalDate   = currentAcademicYear?.finalClosureDate
    ? new Date(currentAcademicYear.finalClosureDate).toLocaleDateString("en-GB") : "—";

  return (
    <>
      {/* ── Terms gate modal ─────────────────────────────── */}
      {showTermsGate && (
        <TermsGateModal
          onConfirm={() => {
            setShowTermsGate(false);
            // Navigate to /terms; after accepting, redirect back to /submit-idea
            navigate("/terms", { state: { from: "/submit-idea" } });
          }}
        />
      )}

      <div className="id-page">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="id-page-header">
          <div>
            <h1 className="id-page-title">Submit Idea</h1>
            <p className="id-page-sub">Share your innovation with the organization</p>
          </div>
          {/* Terms accepted badge */}
          {localStorage.getItem("acceptedTerms") && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 12, background: "#ecfdf5", color: "#059669",
              border: "1px solid #a7f3d0", padding: "5px 12px",
              borderRadius: 20, fontWeight: 600,
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="13" height="13">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Terms Accepted
            </span>
          )}
        </div>

        {/* ── Main grid ────────────────────────────────────── */}
        <div className="id-submit-grid">

          {/* ── Form ───────────────────────────────────────── */}
          <div className="id-card">
            <div className="id-card-head">
              <span className="id-card-title">Idea Information</span>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "22px 24px" }}>

              {/* Title */}
              <div className="id-form-group">
                <label className="id-form-label">
                  Title <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  className="id-form-input"
                  placeholder="Enter your idea title..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  maxLength={120}
                />
                <span className="id-form-hint">{form.title.length}/120 characters</span>
              </div>

              {/* Category */}
              <div className="id-form-group">
                <label className="id-form-label">Category</label>
                <select
                  className="id-form-select"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="id-form-group">
                <label className="id-form-label">
                  Description <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  className="id-form-textarea"
                  rows="7"
                  placeholder="Describe your idea in detail — the problem to solve, proposed solution, and expected benefits..."
                  value={form.description}
                  onChange={handleDescChange}
                  maxLength={2000}
                />
                <span className="id-form-hint">{charCount}/2000 characters</span>
              </div>

              {/* Anonymous */}
              <div className="id-form-group">
                <label className="id-form-check" onClick={() => setForm({ ...form, isAnonymous: !form.isAnonymous })}>
                  <input
                    type="checkbox"
                    checked={form.isAnonymous}
                    onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <div className="id-form-check-label">Submit anonymously</div>
                    <div className="id-form-hint" style={{ marginTop: 1 }}>
                      Your name will not be displayed publicly
                    </div>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="id-form-actions">
                <button type="button" className="id-btn id-btn--ghost" onClick={() => navigate("/ideas")}>
                  Cancel
                </button>
                <button type="submit" className="id-btn id-btn--primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Submit Idea
                </button>
              </div>

            </form>
          </div>

          {/* ── Sidebar ──────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <div className="id-sidebar-card">
              <div className="id-sidebar-card-head">Academic Year</div>
              <div className="id-sidebar-card-body">
                <div className="id-info-row">
                  <span className="id-info-key">Academic Year</span>
                  <span className="id-info-value">{yearName}</span>
                </div>
                <div className="id-info-row">
                  <span className="id-info-key">Status</span>
                  {isClosed
                    ? <span className="id-status-closed">● Closed</span>
                    : <span className="id-status-open">● Open</span>
                  }
                </div>
                <div className="id-info-row">
                  <span className="id-info-key">Submission Deadline</span>
                  <span className="id-info-value">{closureDate}</span>
                </div>
                <div className="id-info-row">
                  <span className="id-info-key">Comment Deadline</span>
                  <span className="id-info-value">{finalDate}</span>
                </div>
              </div>
            </div>

            <div className="id-sidebar-card">
              <div className="id-sidebar-card-head">Submitter Info</div>
              <div className="id-sidebar-card-body">
                <div className="id-info-row">
                  <span className="id-info-key">Full Name</span>
                  <span className="id-info-value">{user.fullName || user.full_name}</span>
                </div>
                <div className="id-info-row">
                  <span className="id-info-key">Email</span>
                  <span className="id-info-value" style={{ fontSize: 12 }}>{user.email}</span>
                </div>
                <div className="id-info-row">
                  <span className="id-info-key">Department</span>
                  <span className="id-info-value">{user.department || user.dept_name || "—"}</span>
                </div>
              </div>
            </div>

            <div className="id-tip-box">
              💡 <strong>Tip:</strong> Clear ideas with concrete evidence and actionable solutions are rated higher.
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitIdea;
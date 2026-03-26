import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/terms-modal.css"; // ← điều chỉnh path nếu cần

const RULES = [
  "All submitted ideas become the intellectual property of the university.",
  "Staff must not submit content that violates copyright, law, or internal policy.",
  "The university reserves the right to use, modify, or reject ideas without prior notice.",
  "All submitted content must align with the university's ethical and cultural standards.",
  "Staff must accept the latest Terms & Conditions version before submitting any subsequent ideas.",
];

const TermsAccept = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu điều hướng từ /submit-idea (state.from), sau khi accept → quay lại
  // Ngược lại → về /submit-idea mặc định
  const returnTo = location.state?.from ?? "/submit-idea";

  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    localStorage.setItem("acceptedTerms", "true");
    navigate(returnTo);
  };

  const handleCancel = () => {
    navigate("/ideas");
  };

  return (
    <div className="ta-page">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="ta-header">
        <div className="ta-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div>
          <h1 className="ta-title">Terms &amp; Conditions</h1>
          <p className="ta-sub">Please read carefully before submitting your idea</p>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="ta-card">
        <div className="ta-card-head">University Idea Management — Policy Agreement</div>
        <div className="ta-card-body">

          <p className="ta-intro">
            By submitting ideas to the University Idea Management System, you agree to the
            following rules and policies. These terms ensure a respectful, lawful, and
            productive environment for sharing innovation.
          </p>

          <ul className="ta-rules">
            {RULES.map((rule, i) => (
              <li key={i} className="ta-rule">
                <span className="ta-rule-num">{i + 1}</span>
                <span className="ta-rule-text">{rule}</span>
              </li>
            ))}
          </ul>

          {/* Agree checkbox */}
          <label
            className="ta-agree-row"
            onClick={() => setChecked((c) => !c)}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="ta-agree-label">
              I have read and agree to all Terms &amp; Conditions stated above.
            </span>
          </label>

        </div>
      </div>

      {/* ── Actions ────────────────────────────────────────── */}
      <div className="ta-actions">
        <button className="ta-btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button
          className="ta-btn-accept"
          onClick={handleAccept}
          disabled={!checked}
          title={!checked ? "Please tick the checkbox above first" : ""}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          I Agree — Continue
        </button>
      </div>

    </div>
  );
};

export default TermsAccept;
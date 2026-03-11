import { useState } from "react";
import "../../styles/admin.shared.css";
import "../../styles/TermsConditions.css";

// ── Schema: terms_condition { tc_id, content, version, effective_date, created_at }
// ── Schema: user_terms_acceptance { user_id, tc_id, accepted_at }

var INITIAL_TERMS = [
  {
    tc_id: 1,
    version: 1,
    content: "All submitted ideas become the intellectual property of the university. Staff must not submit content that violates copyright, law, or internal policy. The university reserves the right to use, modify, or reject ideas without prior notice.",
    effective_date: "2023-01-01",
    created_at: "2023-01-01",
  },
  {
    tc_id: 2,
    version: 2,
    content: "All submitted ideas become the intellectual property of the university. Staff must not submit content that violates copyright, law, or internal policy. The university reserves the right to use, modify, or reject ideas without prior notice. All submitted content must align with the university's ethical and cultural standards.",
    effective_date: "2024-01-15",
    created_at: "2024-01-10",
  },
  {
    tc_id: 3,
    version: 3,
    content: "All submitted ideas become the intellectual property of the university. Staff must not submit content that violates copyright, law, or internal policy. The university reserves the right to use, modify, or reject ideas without prior notice. All submitted content must align with the university's ethical and cultural standards. Staff must accept the latest T&C version before submitting any subsequent ideas.",
    effective_date: "2025-01-10",
    created_at: "2025-01-08",
    isActive: true,
  },
];

var IconClose = function() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
};

var TermsConditions = function() {
  var termsState = useState(INITIAL_TERMS);
  var terms = termsState[0];
  var setTerms = termsState[1];

  var addState = useState(false);
  var showAdd = addState[0];
  var setShowAdd = addState[1];

  var viewState = useState(false);
  var showView = viewState[0];
  var setShowView = viewState[1];

  var selState = useState(null);
  var selectedTerm = selState[0];
  var setSelectedTerm = selState[1];

  var contentState = useState("");
  var newContent = contentState[0];
  var setNewContent = contentState[1];

  var effDateState = useState("");
  var newEffDate = effDateState[0];
  var setNewEffDate = effDateState[1];

  var errState = useState({});
  var formErrors = errState[0];
  var setFormErrors = errState[1];

  // Active term = highest version (latest created)
  var activeTerm = terms.reduce(function(max, t) { return t.version > max.version ? t : max; }, terms[0]);
  var nextVersion = activeTerm.version + 1;

  function validateNew() {
    var errs = {};
    if (!newContent.trim()) errs.content = "content is required";
    if (!newEffDate) errs.effective_date = "effective_date is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // POST /api/terms-conditions  { content, version (auto), effective_date }
  function handleCreate() {
    if (!validateNew()) return;
    var newTerm = {
      tc_id: Date.now(),
      version: nextVersion,
      content: newContent.trim(),
      effective_date: newEffDate,
      created_at: new Date().toISOString().split("T")[0],
      isActive: true,
    };
    setTerms(function(prev) { return prev.concat([newTerm]); });
    setShowAdd(false);
    setNewContent("");
    setNewEffDate("");
    setFormErrors({});
  }

  function openView(term) { setSelectedTerm(term); setShowView(true); }

  var sortedDesc = terms.slice().sort(function(a, b) { return b.version - a.version; });

  return (
    <div className="terms-mgmt">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Terms &amp; Conditions</h1>
          <p>View the current T&amp;C version and create new versions for the system</p>
        </div>
        <button className="btn btn-primary" onClick={function() { setNewContent(""); setNewEffDate(""); setFormErrors({}); setShowAdd(true); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create New Version
        </button>
      </div>

      {/* Active T&C Card */}
      <div className="active-term-card">
        <div className="active-term-header">
          <div className="active-term-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Current Version — v{activeTerm.version}
          </div>
          <div className="active-term-meta">
            effective_date: {activeTerm.effective_date} &nbsp;·&nbsp; tc_id: #{activeTerm.tc_id}
          </div>
        </div>
        <div className="active-term-content">{activeTerm.content}</div>
        <div className="active-term-notice">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Staff must accept this T&amp;C (<code>user_terms_acceptance</code>) before submitting a new idea
        </div>
      </div>

      {/* Version History */}
      <div className="admin-card">
        <div className="card-header">
          <span className="card-title">Version History ({terms.length})</span>
          <span className="version-next-badge">Next: v{nextVersion}</span>
        </div>
        <div className="terms-timeline">
          {sortedDesc.map(function(term, idx) {
            var isCurrent = term.version === activeTerm.version;
            return (
              <div key={term.tc_id} className={"timeline-item " + (isCurrent ? "timeline-item--active" : "")}>
                <div className="timeline-connector">
                  <div className="timeline-dot"/>
                  {idx < terms.length - 1 && <div className="timeline-line"/>}
                </div>
                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <div className="timeline-version">
                      <span className="version-tag">v{term.version}</span>
                      {isCurrent && <span className="badge badge--active">Current</span>}
                    </div>
                    <div className="timeline-meta">effective_date: {term.effective_date} &nbsp;·&nbsp; created_at: {term.created_at} &nbsp;·&nbsp; tc_id: #{term.tc_id}</div>
                  </div>
                  <div className="timeline-preview">
                    {term.content.length > 140 ? term.content.substring(0, 140) + "..." : term.content}
                  </div>
                  <div className="timeline-actions">
                    <button className="btn btn-sm btn-secondary" onClick={function() { openView(term); }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      View Full
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE MODAL */}
      {showAdd && (
        <div className="modal-overlay" onClick={function() { setShowAdd(false); }}>
          <div className="modal modal--lg" onClick={function(e) { e.stopPropagation(); }}>
            <div className="modal-header">
              <h2>Create T&amp;C — v{nextVersion}</h2>
              <button className="modal-close" onClick={function() { setShowAdd(false); }}><IconClose/></button>
            </div>
            <div className="modal-body">
              <div className="new-version-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Version will be auto-set to v{nextVersion}. Once created, this becomes the active version staff must accept.
              </div>
              <div className="form-group" style={{ marginTop: 14 }}>
                <label className="form-label">effective_date <span>*</span></label>
                <input type="date" className="form-control" value={newEffDate} onChange={function(e) { setNewEffDate(e.target.value); }}/>
                {formErrors.effective_date && <div className="form-error">{formErrors.effective_date}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">content <span>*</span></label>
                <textarea className="form-control" rows="8" placeholder="Enter the full Terms & Conditions text..." value={newContent}
                  onChange={function(e) { setNewContent(e.target.value); setFormErrors(function(f) { return Object.assign({}, f, { content: "" }); }); }}
                />
                <div className="form-hint">{newContent.length} characters</div>
                {formErrors.content && <div className="form-error">{formErrors.content}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={function() { setShowAdd(false); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create Version</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showView && selectedTerm && (
        <div className="modal-overlay" onClick={function() { setShowView(false); }}>
          <div className="modal modal--lg" onClick={function(e) { e.stopPropagation(); }}>
            <div className="modal-header">
              <h2>Terms &amp; Conditions — v{selectedTerm.version}</h2>
              <button className="modal-close" onClick={function() { setShowView(false); }}><IconClose/></button>
            </div>
            <div className="modal-body">
              <div className="view-term-meta">
                <span>tc_id: #{selectedTerm.tc_id}</span>
                <span>effective_date: {selectedTerm.effective_date}</span>
                <span>created_at: {selectedTerm.created_at}</span>
                {selectedTerm.version === activeTerm.version && <span className="badge badge--active">Current</span>}
              </div>
              <div className="view-term-content">{selectedTerm.content}</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={function() { setShowView(false); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsConditions;
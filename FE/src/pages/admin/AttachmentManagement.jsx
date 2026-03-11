import { useState, useMemo } from "react";
import "../../styles/admin.shared.css";
import "../../styles/AttachmentManagement.css";

// ── Schema: document { doc_id, idea_id, file_name, file_path,
//                      file_type, file_size_kb, uploaded_at }

var FILE_STYLE = {
  pdf:  { label: "PDF",  color: "#ef4444", bg: "#fef2f2" },
  docx: { label: "DOC",  color: "#3b82f6", bg: "#eff6ff" },
  doc:  { label: "DOC",  color: "#3b82f6", bg: "#eff6ff" },
  xlsx: { label: "XLS",  color: "#10b981", bg: "#f0fdf4" },
  xls:  { label: "XLS",  color: "#10b981", bg: "#f0fdf4" },
  pptx: { label: "PPT",  color: "#f59e0b", bg: "#fffbeb" },
  jpg:  { label: "IMG",  color: "#8b5cf6", bg: "#f5f3ff" },
  jpeg: { label: "IMG",  color: "#8b5cf6", bg: "#f5f3ff" },
  png:  { label: "IMG",  color: "#8b5cf6", bg: "#f5f3ff" },
  zip:  { label: "ZIP",  color: "#64748b", bg: "#f1f5f9" },
  txt:  { label: "TXT",  color: "#6b7280", bg: "#f9fafb" },
};

function getExt(file_name) { return file_name.split(".").pop().toLowerCase(); }

// file_size_kb is stored in KB in the schema
function fmtSize(file_size_kb) {
  if (file_size_kb < 1024) return file_size_kb.toFixed(1) + " KB";
  return (file_size_kb / 1024).toFixed(1) + " MB";
}

var DEPARTMENTS = [
  { dept_id: 1, dept_name: "Engineering" },
  { dept_id: 2, dept_name: "Marketing"   },
  { dept_id: 3, dept_name: "HR"          },
  { dept_id: 4, dept_name: "Finance"     },
  { dept_id: 5, dept_name: "Operations"  },
  { dept_id: 6, dept_name: "Design"      },
];

// Mock documents matching schema fields
// file_size_kb stores value in KB as per schema
var INITIAL_DOCUMENTS = [
  { doc_id: 1, idea_id: 101, file_name: "proposal_2025.pdf",      file_path: "/uploads/101/proposal_2025.pdf",      file_type: "application/pdf",           file_size_kb: 2398,  uploaded_at: "2025-01-15", uploader_name: "Nguyen Van An",  dept_id: 1, idea_title: "Onboarding Process Improvement"     },
  { doc_id: 2, idea_id: 102, file_name: "wireframe_v2.png",        file_path: "/uploads/102/wireframe_v2.png",        file_type: "image/png",                 file_size_kb: 870,   uploaded_at: "2025-01-20", uploader_name: "Tran Thi Binh",  dept_id: 6, idea_title: "Shift Management App"               },
  { doc_id: 3, idea_id: 103, file_name: "budget_analysis.xlsx",    file_path: "/uploads/103/budget_analysis.xlsx",    file_type: "application/vnd.openxmlformats", file_size_kb: 1172, uploaded_at: "2025-02-01", uploader_name: "Le Van Cuong",   dept_id: 4, idea_title: "Operational Cost Optimisation"      },
  { doc_id: 4, idea_id: 104, file_name: "presentation_q1.pptx",    file_path: "/uploads/104/presentation_q1.pptx",    file_type: "application/vnd.pptx",      file_size_kb: 5469,  uploaded_at: "2025-02-10", uploader_name: "Pham Thi Dung",  dept_id: 2, idea_title: "Q1 2025 Marketing Strategy"         },
  { doc_id: 5, idea_id: 105, file_name: "survey_results.docx",     file_path: "/uploads/105/survey_results.docx",     file_type: "application/vnd.docx",      file_size_kb: 332,   uploaded_at: "2025-02-14", uploader_name: "Hoang Minh Duc", dept_id: 3, idea_title: "Employee Satisfaction Survey"       },
  { doc_id: 6, idea_id: 106, file_name: "system_architecture.pdf", file_path: "/uploads/106/system_architecture.pdf", file_type: "application/pdf",           file_size_kb: 3027,  uploaded_at: "2025-02-20", uploader_name: "Vu Thi Huong",   dept_id: 1, idea_title: "CI/CD System Upgrade"              },
  { doc_id: 7, idea_id: 107, file_name: "mockup_v3.zip",           file_path: "/uploads/107/mockup_v3.zip",           file_type: "application/zip",           file_size_kb: 12500, uploaded_at: "2025-02-28", uploader_name: "Dang Quoc Khai", dept_id: 6, idea_title: "Dashboard Redesign"                 },
  { doc_id: 8, idea_id: 108, file_name: "notes.txt",               file_path: "/uploads/108/notes.txt",               file_type: "text/plain",                file_size_kb: 4,     uploaded_at: "2025-03-01", uploader_name: "Bui Thi Lan",    dept_id: 5, idea_title: "Internal Communication Improvement" },
];

var PAGE_SIZE = 6;

var IconTrash = function() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
};
var IconClose = function() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
};

var AttachmentManagement = function() {
  var docsState = useState(INITIAL_DOCUMENTS);
  var documents = docsState[0];
  var setDocuments = docsState[1];

  var searchState = useState("");
  var search = searchState[0];
  var setSearch = searchState[1];

  var deptState = useState("");
  var filterDept = deptState[0];
  var setFilterDept = deptState[1];

  var pageState = useState(1);
  var currentPage = pageState[0];
  var setCurrentPage = pageState[1];

  var confirmState = useState(null); // doc to delete
  var toDelete = confirmState[0];
  var setToDelete = confirmState[1];

  var bulkState = useState(false);
  var showBulk = bulkState[0];
  var setShowBulk = bulkState[1];

  var selState = useState(new Set());
  var selected = selState[0];
  var setSelected = selState[1];

  var filtered = useMemo(function() {
    var q = search.toLowerCase();
    return documents.filter(function(d) {
      var ms = d.file_name.toLowerCase().includes(q) || d.uploader_name.toLowerCase().includes(q) || d.idea_title.toLowerCase().includes(q);
      var md = filterDept ? String(d.dept_id) === filterDept : true;
      return ms && md;
    });
  }, [documents, search, filterDept]);

  var totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  var paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  var totalSizeKb = documents.reduce(function(s, d) { return s + d.file_size_kb; }, 0);

  function toggleSelect(id) {
    setSelected(function(prev) {
      var next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function toggleAll() {
    var allIds = paginated.map(function(d) { return d.doc_id; });
    var allSelected = allIds.every(function(id) { return selected.has(id); });
    if (allSelected) {
      setSelected(function(prev) {
        var next = new Set(prev);
        allIds.forEach(function(id) { next.delete(id); });
        return next;
      });
    } else {
      setSelected(function(prev) {
        var next = new Set(prev);
        allIds.forEach(function(id) { next.add(id); });
        return next;
      });
    }
  }

  // DELETE /api/documents/:doc_id
  function handleDelete() {
    var id = toDelete.doc_id;
    setDocuments(function(prev) { return prev.filter(function(d) { return d.doc_id !== id; }); });
    setSelected(function(prev) { var n = new Set(prev); n.delete(id); return n; });
    setToDelete(null);
  }

  // DELETE /api/documents  { doc_ids: [...] }
  function handleBulkDelete() {
    var ids = new Set(selected);
    setDocuments(function(prev) { return prev.filter(function(d) { return !ids.has(d.doc_id); }); });
    setSelected(new Set());
    setShowBulk(false);
  }

  return (
    <div className="attach-mgmt">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Attachment Management</h1>
          <p>View and delete attached documents across the entire system</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon stat-icon--indigo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </div>
          <div><div className="stat-val">{documents.length}</div><div className="stat-label">Total Documents</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--sky">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div><div className="stat-val">{fmtSize(totalSizeKb)}</div><div className="stat-label">Total Size (file_size_kb)</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--emerald">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <div><div className="stat-val">{DEPARTMENTS.length}</div><div className="stat-label">Departments</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--rose">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </div>
          <div><div className="stat-val">{selected.size}</div><div className="stat-label">Selected</div></div>
        </div>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <span className="card-title">Document List ({filtered.length})</span>
          <div className="filter-bar">
            {selected.size > 0 && (
              <button className="btn btn-danger btn-sm" onClick={function() { setShowBulk(true); }}>
                <IconTrash/>
                Delete {selected.size} files
              </button>
            )}
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="search-input" placeholder="Search file_name, uploader, idea..."
                value={search} onChange={function(e) { setSearch(e.target.value); setCurrentPage(1); }}/>
            </div>
            <select className="filter-select" value={filterDept} onChange={function(e) { setFilterDept(e.target.value); setCurrentPage(1); }}>
              <option value="">All Departments</option>
              {DEPARTMENTS.map(function(d) { return <option key={d.dept_id} value={String(d.dept_id)}>{d.dept_name}</option>; })}
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" className="table-checkbox"
                    checked={paginated.length > 0 && paginated.every(function(d) { return selected.has(d.doc_id); })}
                    onChange={toggleAll}
                  />
                </th>
                <th>file_name</th>
                <th>idea (idea_id)</th>
                <th>Uploaded by</th>
                <th>Department</th>
                <th>uploaded_at</th>
                <th>file_size_kb</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan="8">
                  <div className="empty-state">
                    <h3>No documents found</h3><p>Try adjusting your filters</p>
                  </div>
                </td></tr>
              ) : paginated.map(function(doc) {
                var ext = getExt(doc.file_name);
                var fs = FILE_STYLE[ext] || { label: "FILE", color: "#64748b", bg: "#f1f5f9" };
                return (
                  <tr key={doc.doc_id} className={selected.has(doc.doc_id) ? "row-selected" : ""}>
                    <td>
                      <input type="checkbox" className="table-checkbox" checked={selected.has(doc.doc_id)} onChange={function() { toggleSelect(doc.doc_id); }}/>
                    </td>
                    <td>
                      <div className="file-cell">
                        <div className="file-icon" style={{ background: fs.bg, color: fs.color }}>
                          <span style={{ fontSize: 9, fontWeight: 700 }}>{fs.label}</span>
                        </div>
                        <div>
                          <div className="file-name">{doc.file_name}</div>
                          <div className="file-ext">file_type: {doc.file_type}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="idea-title-cell" title={doc.idea_title}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>#{doc.idea_id}</span>{" "}
                        {doc.idea_title.length > 30 ? doc.idea_title.substring(0, 30) + "..." : doc.idea_title}
                      </div>
                    </td>
                    <td>
                      <div className="table-avatar">
                        <div className="table-avatar-icon" style={{ width: 26, height: 26, fontSize: 11 }}>{doc.uploader_name[0]}</div>
                        <span style={{ fontSize: 13 }}>{doc.uploader_name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge--default">{DEPARTMENTS.find(function(d) { return d.dept_id === doc.dept_id; }) ? DEPARTMENTS.find(function(d) { return d.dept_id === doc.dept_id; }).dept_name : doc.dept_id}</span></td>
                    <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{doc.uploaded_at}</td>
                    <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{fmtSize(doc.file_size_kb)}</td>
                    <td>
                      <button className="btn-icon btn-icon--delete" title="Delete document" onClick={function() { setToDelete(doc); }}><IconTrash/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} documents
            </span>
            <div className="pagination-controls">
              <button className="page-btn" onClick={function() { setCurrentPage(1); }} disabled={currentPage === 1}>«</button>
              <button className="page-btn" onClick={function() { setCurrentPage(function(p) { return p - 1; }); }} disabled={currentPage === 1}>‹</button>
              {Array.from({ length: totalPages }, function(_, i) { return i + 1; }).map(function(p) {
                return <button key={p} className={"page-btn " + (p === currentPage ? "active" : "")} onClick={function() { setCurrentPage(p); }}>{p}</button>;
              })}
              <button className="page-btn" onClick={function() { setCurrentPage(function(p) { return p + 1; }); }} disabled={currentPage === totalPages}>›</button>
              <button className="page-btn" onClick={function() { setCurrentPage(totalPages); }} disabled={currentPage === totalPages}>»</button>
            </div>
          </div>
        )}
      </div>

      {/* SINGLE DELETE */}
      {toDelete && (
        <div className="modal-overlay" onClick={function() { setToDelete(null); }}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={function(e) { e.stopPropagation(); }}>
            <div className="confirm-body">
              <div className="confirm-icon"><IconTrash/></div>
              <h3>Delete document?</h3>
              <p>doc_id <strong>#{toDelete.doc_id}</strong> — <strong>{toDelete.file_name}</strong> will be permanently removed from the system. This cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={function() { setToDelete(null); }}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE */}
      {showBulk && (
        <div className="modal-overlay" onClick={function() { setShowBulk(false); }}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={function(e) { e.stopPropagation(); }}>
            <div className="confirm-body">
              <div className="confirm-icon"><IconTrash/></div>
              <h3>Delete {selected.size} documents?</h3>
              <p>All <strong>{selected.size}</strong> selected documents will be permanently removed. This cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={function() { setShowBulk(false); }}>Cancel</button>
              <button className="btn btn-danger" onClick={handleBulkDelete}>Delete All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentManagement;
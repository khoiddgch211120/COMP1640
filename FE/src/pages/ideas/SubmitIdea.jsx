import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addIdea } from "../../redux/slices/ideaSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import "../../styles/ideas.css"; // ← điều chỉnh path nếu cần

const CATEGORIES = [
  "Học thuật",
  "Cơ sở vật chất",
  "Công nghệ",
  "Nhân sự",
  "Sinh viên",
  "Khác",
];

const SubmitIdea = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const user                    = useSelector((state) => state.auth.user);
  const { currentAcademicYear } = useSelector((state) => state.academicYear ?? {});

  const [form, setForm] = useState({
    title:       "",
    description: "",
    category:    "",
    isAnonymous: false,
  });

  const [charCount, setCharCount] = useState(0);

  /* ── Closure check ───────────────────────────────────────── */
  const isClosed = currentAcademicYear && new Date() > new Date(currentAcademicYear.closureDate);

  /* ── Access guard ────────────────────────────────────────── */
  if (!user || user.role !== ROLES.STAFF) {
    return (
      <div className="id-page">
        <div className="id-access-denied">
          🚫 Bạn không có quyền truy cập trang này.
        </div>
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
          ⏰ Thời gian nộp ý tưởng đã kết thúc.
        </div>
      </div>
    );
  }

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();

    const acceptedTerms = localStorage.getItem("acceptedTerms");
    if (!acceptedTerms) {
      alert("Bạn phải chấp nhận Điều khoản & Điều kiện trước khi nộp ý tưởng.");
      navigate("/terms");
      return;
    }

    if (!form.title.trim() || !form.description.trim()) {
      alert("Tiêu đề và mô tả là bắt buộc!");
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

  const yearName = currentAcademicYear?.name || "Chưa xác định";
  const closureDate = currentAcademicYear?.closureDate
    ? new Date(currentAcademicYear.closureDate).toLocaleDateString("vi-VN")
    : "—";
  const finalDate = currentAcademicYear?.finalClosureDate
    ? new Date(currentAcademicYear.finalClosureDate).toLocaleDateString("vi-VN")
    : "—";

  return (
    <div className="id-page">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="id-page-header">
        <div>
          <h1 className="id-page-title">Nộp ý tưởng</h1>
          <p className="id-page-sub">Chia sẻ sáng kiến của bạn với tổ chức</p>
        </div>
      </div>

      {/* ── Main grid ──────────────────────────────────────── */}
      <div className="id-submit-grid">

        {/* ── Form ─────────────────────────────────────────── */}
        <div className="id-card">
          <div className="id-card-head">
            <span className="id-card-title">Thông tin ý tưởng</span>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: "22px 24px" }}>

            {/* Title */}
            <div className="id-form-group">
              <label className="id-form-label">
                Tiêu đề <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                className="id-form-input"
                placeholder="Nhập tiêu đề ý tưởng..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                maxLength={120}
              />
              <span className="id-form-hint">{form.title.length}/120 ký tự</span>
            </div>

            {/* Category */}
            <div className="id-form-group">
              <label className="id-form-label">Danh mục</label>
              <select
                className="id-form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Chọn danh mục</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="id-form-group">
              <label className="id-form-label">
                Mô tả <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <textarea
                className="id-form-textarea"
                rows="7"
                placeholder="Mô tả chi tiết ý tưởng của bạn — vấn đề cần giải quyết, giải pháp đề xuất, lợi ích mang lại..."
                value={form.description}
                onChange={handleDescChange}
                maxLength={2000}
              />
              <span className="id-form-hint">{charCount}/2000 ký tự</span>
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
                  <div className="id-form-check-label">Nộp ẩn danh</div>
                  <div className="id-form-hint" style={{ marginTop: 1 }}>
                    Tên của bạn sẽ không được hiển thị công khai
                  </div>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="id-form-actions">
              <button
                type="button"
                className="id-btn id-btn--ghost"
                onClick={() => navigate("/ideas")}
              >
                Huỷ
              </button>
              <button type="submit" className="id-btn id-btn--primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Nộp ý tưởng
              </button>
            </div>

          </form>
        </div>

        {/* ── Sidebar ──────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Academic year status */}
          <div className="id-sidebar-card">
            <div className="id-sidebar-card-head">Năm học</div>
            <div className="id-sidebar-card-body">
              <div className="id-info-row">
                <span className="id-info-key">Năm học</span>
                <span className="id-info-value">{yearName}</span>
              </div>
              <div className="id-info-row">
                <span className="id-info-key">Trạng thái</span>
                {isClosed
                  ? <span className="id-status-closed">● Đã đóng</span>
                  : <span className="id-status-open">● Đang mở</span>
                }
              </div>
              <div className="id-info-row">
                <span className="id-info-key">Hạn nộp</span>
                <span className="id-info-value">{closureDate}</span>
              </div>
              <div className="id-info-row">
                <span className="id-info-key">Đóng bình luận</span>
                <span className="id-info-value">{finalDate}</span>
              </div>
            </div>
          </div>

          {/* Submitter info */}
          <div className="id-sidebar-card">
            <div className="id-sidebar-card-head">Thông tin người nộp</div>
            <div className="id-sidebar-card-body">
              <div className="id-info-row">
                <span className="id-info-key">Họ tên</span>
                <span className="id-info-value">{user.fullName || user.full_name}</span>
              </div>
              <div className="id-info-row">
                <span className="id-info-key">Email</span>
                <span className="id-info-value" style={{ fontSize: 12 }}>{user.email}</span>
              </div>
              <div className="id-info-row">
                <span className="id-info-key">Phòng ban</span>
                <span className="id-info-value">{user.department || user.dept_name || "—"}</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="id-tip-box">
            💡 <strong>Mẹo:</strong> Ý tưởng rõ ràng, có dẫn chứng cụ thể và đề xuất giải pháp khả thi sẽ được đánh giá cao hơn.
          </div>

        </div>

      </div>
    </div>
  );
};

export default SubmitIdea;
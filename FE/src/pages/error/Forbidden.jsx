import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
      background: "#f9fafb", color: "#111827",
    }}>
      <div style={{ fontSize: 64, fontWeight: 800, color: "#ef4444" }}>403</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>Bạn không có quyền truy cập trang này</div>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: 8, padding: "10px 24px", borderRadius: 8,
          background: "#2563eb", color: "#fff", border: "none",
          cursor: "pointer", fontSize: 14, fontWeight: 600,
        }}
      >
        ← Quay lại
      </button>
    </div>
  );
};

export default Forbidden;

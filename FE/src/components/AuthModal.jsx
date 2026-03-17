import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../../styles/auth-modal.css";

/**
 * AuthModal — wrapper hiển thị modal nổi trên IdeaList.
 * Bấm backdrop hoặc nút X sẽ đóng modal và quay về /ideas.
 */
const AuthModal = ({ children, title }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/ideas");
  };

  // Đóng modal khi bấm Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Khóa scroll khi modal mở
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="auth-modal-backdrop" onClick={handleClose}>
      <div
        className="auth-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Close button */}
        <button className="auth-modal-close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
};

export default AuthModal;
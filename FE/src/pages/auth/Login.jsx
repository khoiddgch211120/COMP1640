import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notification } from "antd";
import "antd/dist/reset.css";

import illustration from "../../assets/Investment data-rafiki 1.png";
import logo from "../../assets/Logo.png";
import "./../../styles/login.css";

import AuthModal from "../../components/AuthModal"; // ← điều chỉnh path nếu cần
import { loginSuccess } from "../../redux/slices/authSlice";
import { ROLES } from "../../constants/roles";

const MOCK_ACCOUNTS = [
  { email: "admin@university.edu",       password: "admin123",   role: ROLES.ADMIN,          fullName: "Admin System"        },
  { email: "manager@university.edu",     password: "manager123", role: ROLES.QA_MANAGER,     fullName: "Nguyễn QA Manager"   },
  { email: "coordinator@university.edu", password: "coord123",   role: ROLES.QA_COORDINATOR, fullName: "Trần QA Coordinator" },
  { email: "staff@university.edu",       password: "staff123",   role: ROLES.STAFF,          fullName: "Lê Staff User"       },
];

const ROLE_ROUTE = {
  [ROLES.ADMIN]:          "/admin/dashboard",
  [ROLES.QA_MANAGER]:     "/manager",
  [ROLES.QA_COORDINATOR]: "/coordinator",
  [ROLES.STAFF]:          "/ideas",
};

const ROLE_LABEL = {
  [ROLES.ADMIN]:          "Admin",
  [ROLES.QA_MANAGER]:     "QA Manager",
  [ROLES.QA_COORDINATOR]: "QA Coordinator",
  [ROLES.STAFF]:          "Staff",
};

const Login = ({ isModal = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Giữ nguyên background khi chuyển giữa các trang auth trong modal
  const bgState = location.state?.background;
  const goToAuth = (path) =>
    navigate(path, isModal ? { state: { background: bgState } } : undefined);

  const fillMock = (acc) => { setEmail(acc.email); setPassword(acc.password); };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      notification.warning({ title: "Thiếu thông tin", description: "Vui lòng nhập email và mật khẩu" });
      return;
    }
    try {
      setLoading(true);
      const found = MOCK_ACCOUNTS.find((a) => a.email === email && a.password === password);
      if (!found) {
        notification.error({ title: "Đăng nhập thất bại", description: "Email hoặc mật khẩu không đúng" });
        setLoading(false);
        return;
      }
      dispatch(loginSuccess({
        user:  { fullName: found.fullName, email: found.email, role: found.role },
        token: "mock-token-" + found.role.toLowerCase(),
      }));
      notification.success({ title: "Đăng nhập thành công", description: `Chào mừng, ${found.fullName}!` });
      navigate(ROLE_ROUTE[found.role]);
    } catch {
      notification.error({ title: "Đăng nhập thất bại" });
    } finally {
      setLoading(false);
    }
  };

  /* ══════════════════════════════════════════════════════════
     MODAL VERSION — hoàn toàn dùng class am-* từ auth-modal.css
     KHÔNG import hay dùng bất kỳ class nào từ login.css
  ══════════════════════════════════════════════════════════ */
  if (isModal) {
    return (
      <AuthModal>
        <img src={logo} alt="Logo" className="am-logo" />
        <h2 className="am-title">Đăng nhập</h2>

        {/* Mock chips */}
        <div className="am-mock">
          <div className="am-mock-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Mock — click để điền nhanh
          </div>
          <div className="am-mock-grid">
            {MOCK_ACCOUNTS.map((acc) => (
              <button key={acc.role} type="button" className="am-chip" onClick={() => fillMock(acc)}>
                <span className="am-chip-role">{ROLE_LABEL[acc.role]}</span>
                <span className="am-chip-email">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="am-group">
            <label className="am-label">Email</label>
            <input type="email" className="am-input" placeholder="abc@university.edu"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="am-group">
            <label className="am-label">Mật khẩu</label>
            <div className="am-pw-wrap">
              <input type={showPassword ? "text" : "password"} className="am-input"
                placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="am-pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          <button type="submit" className="am-btn-primary" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="am-footer">
            <button type="button" className="am-link am-link-secondary"
              onClick={() => goToAuth("/forgot-password")}>
              Quên mật khẩu?
            </button>
            <span className="am-link-row">
              Chưa có tài khoản?{" "}
              <button type="button" className="am-link am-link-primary"
                onClick={() => goToAuth("/register")}>
                Đăng ký ngay
              </button>
            </span>
          </div>
        </form>
      </AuthModal>
    );
  }

  /* ══════════════════════════════════════════════════════════
     FULL-PAGE VERSION — giữ nguyên 100% như cũ
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <img src={logo} alt="University Logo" className="login-logo" />
          <h1 className="login-title">University Idea Management System</h1>

          <div className="mock-credentials">
            <div className="mock-credentials-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Mock accounts — click to auto-fill
            </div>
            <div className="mock-credentials-grid">
              {MOCK_ACCOUNTS.map((acc) => (
                <button key={acc.role} type="button"
                  className={`mock-chip mock-chip--${acc.role.toLowerCase().replace("_", "-")}`}
                  onClick={() => fillMock(acc)}>
                  <span className="mock-chip-role">{ROLE_LABEL[acc.role]}</span>
                  <span className="mock-chip-email">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="abc@university.edu" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********" className="form-input password-input" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle" aria-label="Toggle password visibility">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="forgot-password-link">
              <button type="button" onClick={() => navigate("/forgot-password")} className="link-button secondary">
                Forgot Password?
              </button>
            </div>
            <div className="register-link">
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => navigate("/register")} className="link-button primary">
                Create one
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="vertical-separator" />
      <div className="login-illustration-section">
        <img src={illustration} alt="Illustration" className="illustration-image" />
      </div>
    </div>
  );
};

export default Login;
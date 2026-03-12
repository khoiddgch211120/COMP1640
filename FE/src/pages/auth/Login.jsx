import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notification } from "antd";
import "antd/dist/reset.css";

import illustration from "../../assets/Investment data-rafiki 1.png";
import logo from "../../assets/Logo.png";
import "./../../styles/login.css";

import { loginSuccess } from "../../redux/slices/authSlice";
import { ROLES } from "../../constants/roles";

// ─── Mock accounts ────────────────────────────────────────────────────────────
const MOCK_ACCOUNTS = [
  {
    email: "admin@university.edu",
    password: "admin123",
    role: ROLES.ADMIN,
    fullName: "Admin System",
  },
  {
    email: "manager@university.edu",
    password: "manager123",
    role: ROLES.QA_MANAGER,
    fullName: "Nguyễn QA Manager",
  },
  {
    email: "coordinator@university.edu",
    password: "coord123",
    role: ROLES.QA_COORDINATOR,
    fullName: "Trần QA Coordinator",
  },
  {
    email: "staff@university.edu",
    password: "staff123",
    role: ROLES.STAFF,
    fullName: "Lê Staff User",
  },
];

const ROLE_ROUTE = {
  [ROLES.ADMIN]: "/admin",
  [ROLES.QA_MANAGER]: "/manager",
  [ROLES.QA_COORDINATOR]: "/coordinator",
  [ROLES.STAFF]: "/",
};

const ROLE_LABEL = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.QA_MANAGER]: "QA Manager",
  [ROLES.QA_COORDINATOR]: "QA Coordinator",
  [ROLES.STAFF]: "Staff",
};
// ──────────────────────────────────────────────────────────────────────────────

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Quick-fill a mock account
  const fillMock = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      notification.warning({
        message: "Missing information",
        description: "Please enter email and password",
      });
      return;
    }

    try {
      setLoading(true);

      // Match mock account
      const found = MOCK_ACCOUNTS.find(
        (acc) => acc.email === email && acc.password === password
      );

      if (!found) {
        notification.error({
          message: "Login failed",
          description: "Email or password is incorrect",
        });
        setLoading(false);
        return;
      }

      dispatch(
        loginSuccess({
          user: {
            fullName: found.fullName,
            email: found.email,
            role: found.role,
          },
          token: "mock-token-" + found.role.toLowerCase(),
        })
      );

      notification.success({
        message: "Login successful",
        description: `Welcome, ${found.fullName}!`,
      });

      navigate(ROLE_ROUTE[found.role]);
    } catch (error) {
      notification.error({ message: "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Form */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <img src={logo} alt="University Logo" className="login-logo" />

          <h1 className="login-title">University Idea Management System</h1>

          {/* ── Mock credentials panel ── */}
          <div className="mock-credentials">
            <div className="mock-credentials-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Mock accounts — click to auto-fill
            </div>
            <div className="mock-credentials-grid">
              {MOCK_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  className={`mock-chip mock-chip--${acc.role.toLowerCase().replace("_", "-")}`}
                  onClick={() => fillMock(acc)}
                >
                  <span className="mock-chip-role">{ROLE_LABEL[acc.role]}</span>
                  <span className="mock-chip-email">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abc@university.edu"
                className="form-input"
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="form-input password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Forgot Password Link */}
            <div className="forgot-password-link">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="link-button secondary"
              >
                Forgot Password?
              </button>
            </div>

            {/* Register Link */}
            <div className="register-link">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="link-button primary"
              >
                Create one
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Separator Line */}
      <div className="vertical-separator"></div>

      {/* Right Side - Illustration */}
      <div className="login-illustration-section">
        <img
          src={illustration}
          alt="Idea Management Illustration"
          className="illustration-image"
        />
      </div>
    </div>
  );
};

export default Login;
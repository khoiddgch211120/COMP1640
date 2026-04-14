import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notification } from "antd";
import "antd/dist/reset.css";

import illustration from "../../assets/Investment data-rafiki 1.png";
import logo from "../../assets/Logo.png";
import "./../../styles/login.css";

import { loginSuccess, normalizeRole } from "../../redux/slices/authSlice";
import { login as loginApi } from "../../services/authService";
import { ROLES } from "../../constants/roles";

/* ============================================================
   ROLE ROUTE - Redirect after successful login
============================================================ */
const ROLE_ROUTE = {
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.QA_MANAGER]: "/statistics",
  [ROLES.QA_COORDINATOR]: "/coordinator/dashboard",
  [ROLES.DEPT_MANAGER]: "/statistics",
  [ROLES.HEAD]: "/statistics",
  [ROLES.HR_MANAGER]: "/statistics",
  [ROLES.ACADEMIC_STAFF]: "/ideas",
  [ROLES.SUPPORT_STAFF]: "/ideas",
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      notification.warning({
        message: "Missing information",
        description: "Please enter your email and password",
      });
      return;
    }

    try {
      setLoading(true);

      // 1. Call login API (response from Swagger includes department_id)
      const data = await loginApi({ email, password });

      // 2. Normalize Role for routing
      const role = normalizeRole(data.role);

      // 3. Pass full 'data' object to loginSuccess
      // authSlice will split token and group remaining fields (department_id, email...) into user
      dispatch(loginSuccess(data));

      notification.success({
        message: "Login successful",
      });

      // 4. Navigate to the correct page based on role
      const targetPath = ROLE_ROUTE[role] || "/ideas";
      navigate(targetPath);

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Invalid email or password";

      notification.error({
        message: "Login failed",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <img src={logo} alt="University Logo" className="login-logo" />
          <h1 className="login-title">
            University Idea Management System
          </h1>

          <form className="login-form" onSubmit={handleLogin}>
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
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="forgot-password-link">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="link-button secondary"
              >
                Forgot Password?
              </button>
            </div>

            <div className="register-link">
              Don&apos;t have an account?{" "}
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

      <div className="vertical-separator" />

      <div className="login-illustration-section">
        <img src={illustration} alt="Illustration" className="illustration-image" />
      </div>
    </div>
  );
};

export default Login;
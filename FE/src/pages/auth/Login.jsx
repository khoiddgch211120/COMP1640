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
        description: "Please enter email and password",
      });
      return;
    }

    try {
      setLoading(true);

      // Mock role-based login
      let role = ROLES.STAFF;

      if (email.includes("admin")) role = ROLES.ADMIN;
      if (email.includes("manager")) role = ROLES.QA_MANAGER;
      if (email.includes("coordinator")) role = ROLES.QA_COORDINATOR;

      const userData = {
        name: "Test User",
        email,
        role,
      };

      dispatch(
        loginSuccess({
          user: userData,
          token: "fake-token",
        })
      );

      notification.success({
        message: "Login successful",
      });

      // Role-based navigation
      switch (role) {
        case ROLES.ADMIN:
          navigate("/admin");
          break;
        case ROLES.QA_MANAGER:
          navigate("/manager");
          break;
        case ROLES.QA_COORDINATOR:
          navigate("/coordinator");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      notification.error({
        message: "Login failed",
      });
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
            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
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
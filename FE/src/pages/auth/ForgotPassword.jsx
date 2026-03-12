import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import illustration from "../../assets/Investment data-rafiki 1.png";
import logo from "../../assets/Logo.png";
import "./../../styles/forgot-password.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      notification.warning({
        message: "Missing email",
        description: "Please enter your university email",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notification.error({
        message: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      notification.success({
        message: "Reset link sent",
        description:
          "If this email exists, a password reset link has been sent to your inbox.",
      });
      setLoading(false);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }, 1500);
  };

  return (
    <div className="forgot-password-container">
      {/* Left Side - Form */}
      <div className="forgot-password-form-section">
        <div className="forgot-password-form-wrapper">
          <img
            src={logo}
            alt="University Logo"
            className="forgot-password-logo"
          />

          <h1 className="forgot-password-title">Reset Your Password</h1>

          <p className="forgot-password-description">
            Enter your university email address and we will send you a password
            reset link.
          </p>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">University Email</label>
              <input
                type="email"
                placeholder="abc@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="forgot-password-button"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Back to Login Link */}
            <div className="back-to-login">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="link-button secondary"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Separator Line */}
      <div className="vertical-separator"></div>

      {/* Right Side - Illustration */}
      <div className="forgot-password-illustration-section">
        <img
          src={illustration}
          alt="Password Reset Illustration"
          className="illustration-image"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import illustration from "../../assets/Investment data-rafiki 1.png";
import logo from "../../assets/Logo.png";
import { notification } from "antd";
import "./../../styles/register.css";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      notification.warning({
        message: "Missing information",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      notification.error({
        message: "Passwords do not match",
      });
      return;
    }

    if (!formData.department) {
      notification.warning({
        message: "Please select department",
      });
      return;
    }

    if (!formData.agree) {
      notification.warning({
        message: "You must agree to Terms & Conditions",
      });
      return;
    }

    notification.success({
      message: "Registration successful",
      description: "You can now login to your account",
    });

    navigate("/login");
  };

  return (
    <div className="register-container">
      {/* Left Side - Form */}
      <div className="register-form-section">
        <div className="register-form-wrapper">
          <img src={logo} alt="University Logo" className="register-logo" />

          <h1 className="register-title">University Idea Management System</h1>

          <form onSubmit={handleRegister} className="register-form">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                className="form-input"
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="abc@university.edu"
                className="form-input"
                onChange={handleChange}
              />
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                name="department"
                className="form-input form-select"
                onChange={handleChange}
                defaultValue=""
              >
                <option value="" disabled>
                  Select department
                </option>
                <option value="IT">Information Technology</option>
                <option value="Business">Business Administration</option>
                <option value="Design">Design & Arts</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">Human Resources</option>
              </select>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="********"
                  className="form-input password-input"
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="********"
                  className="form-input password-input"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="password-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="terms-group">
              <input
                type="checkbox"
                name="agree"
                id="terms"
                onChange={handleChange}
                className="terms-checkbox"
              />
              <label htmlFor="terms" className="terms-label">
                I agree to the Terms & Conditions
              </label>
            </div>

            {/* Register Button */}
            <button type="submit" className="register-button">
              Register
            </button>

            {/* Login Link */}
            <div className="login-link">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="link-button primary"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Separator Line */}
      <div className="vertical-separator"></div>

      {/* Right Side - Illustration */}
      <div className="register-illustration-section">
        <img
          src={illustration}
          alt="Idea Management Illustration"
          className="illustration-image"
        />
      </div>
    </div>
  );
};

export default Register;
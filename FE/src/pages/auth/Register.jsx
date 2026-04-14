import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import illustration from "../../assets/Investment data-rafiki 1.png";
import logo from "../../assets/Logo.png";
import { notification } from "antd";
import "./../../styles/register.css";
import { register as registerApi } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    staffType: "ACADEMIC",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* =========================
     VALIDATION (FIX)
  ========================= */
  const validate = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      notification.warning({
        title: "Missing information",
        description: "Please fill in all required fields",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      notification.error({ title: "Invalid email" });
      return false;
    }

    if (formData.password.length < 6) {
      notification.error({
        title: "Password too short",
        description: "Minimum 6 characters",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      notification.error({ title: "Passwords do not match" });
      return false;
    }

    if (!formData.agree) {
      notification.warning({ title: "You must agree to the Terms & Conditions" });
      return false;
    }

    return true;
  };

  /* =========================
     SUBMIT (FIX)
  ========================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      // Only send valid staff types
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        staffType:
          formData.staffType === "SUPPORT" ? "SUPPORT" : "ACADEMIC",
      };

      await registerApi(payload);

      notification.success({
        title: "Registration successful",
        description: "You can now log in",
      });

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        staffType: "ACADEMIC",
        agree: false,
      });

      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Registration failed, please try again";

      notification.error({
        title: "Registration failed",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI UNCHANGED 100%
  ========================= */

  /* ===== PAGE VERSION ===== */
  return (
    <div className="register-container">
      <div className="register-form-section">
        <div className="register-form-wrapper">
          <img src={logo} alt="University Logo" className="register-logo" />
          <h1 className="register-title">
            University Idea Management System
          </h1>

          <form onSubmit={handleRegister} className="register-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input password-input"
                  onChange={handleChange}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  className="form-input password-input"
                  onChange={handleChange}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="terms-group">
              <input type="checkbox" name="agree" onChange={handleChange} />
              <label>I agree to the Terms & Conditions</label>
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>

      <div className="vertical-separator" />

      <div className="register-illustration-section">
        <img src={illustration} alt="Illustration" />
      </div>
    </div>
  );
};

export default Register;
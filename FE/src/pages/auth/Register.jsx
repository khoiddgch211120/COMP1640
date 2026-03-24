import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import illustration from "../../assets/Investment data-rafiki 1.png";
import logo from "../../assets/Logo.png";
import { notification } from "antd";
import "./../../styles/register.css";

import AuthModal from "../../components/AuthModal"; // ← điều chỉnh path nếu cần

const Register = ({ isModal = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const bgState = location.state?.background;
  const goToAuth = (path) =>
    navigate(path, isModal ? { state: { background: bgState } } : undefined);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", department: "", agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      notification.warning({ title: "Thiếu thông tin", description: "Vui lòng điền đầy đủ các trường bắt buộc" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      notification.error({ title: "Mật khẩu không khớp" });
      return;
    }
    if (!formData.department) {
      notification.warning({ title: "Vui lòng chọn phòng ban" });
      return;
    }
    if (!formData.agree) {
      notification.warning({ title: "Bạn phải đồng ý với Điều khoản & Điều kiện" });
      return;
    }
    notification.success({ title: "Đăng ký thành công", description: "Bạn có thể đăng nhập ngay bây giờ" });
    goToAuth("/login");
  };

  /* ══════════════════════════════════════════════════════════
     MODAL VERSION
  ══════════════════════════════════════════════════════════ */
  if (isModal) {
    return (
      <AuthModal>
        <img src={logo} alt="Logo" className="am-logo" />
        <h2 className="am-title">Tạo tài khoản</h2>

        <form onSubmit={handleRegister}>
          <div className="am-group">
            <label className="am-label">Họ và tên</label>
            <input type="text" name="fullName" className="am-input"
              placeholder="Nhập họ và tên" onChange={handleChange} />
          </div>

          <div className="am-group">
            <label className="am-label">Email</label>
            <input type="email" name="email" className="am-input"
              placeholder="abc@university.edu" onChange={handleChange} />
          </div>

          <div className="am-group">
            <label className="am-label">Phòng ban</label>
            <select name="department" className="am-input am-select"
              onChange={handleChange} defaultValue="">
              <option value="" disabled>Chọn phòng ban</option>
              <option value="IT">Information Technology</option>
              <option value="Business">Business Administration</option>
              <option value="Design">Design & Arts</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">Human Resources</option>
            </select>
          </div>

          <div className="am-group">
            <label className="am-label">Mật khẩu</label>
            <div className="am-pw-wrap">
              <input type={showPassword ? "text" : "password"} name="password"
                className="am-input" placeholder="••••••••" onChange={handleChange} />
              <button type="button" className="am-pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          <div className="am-group">
            <label className="am-label">Xác nhận mật khẩu</label>
            <div className="am-pw-wrap">
              <input type={showConfirm ? "text" : "password"} name="confirmPassword"
                className="am-input" placeholder="••••••••" onChange={handleChange} />
              <button type="button" className="am-pw-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          <div className="am-terms">
            <input type="checkbox" name="agree" id="am-terms-cb" onChange={handleChange} />
            <label htmlFor="am-terms-cb">Tôi đồng ý với Điều khoản & Điều kiện</label>
          </div>

          <button type="submit" className="am-btn-primary">Đăng ký</button>

          <div className="am-footer">
            <span className="am-link-row">
              Đã có tài khoản?{" "}
              <button type="button" className="am-link am-link-primary" onClick={() => goToAuth("/login")}>
                Đăng nhập
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
    <div className="register-container">
      <div className="register-form-section">
        <div className="register-form-wrapper">
          <img src={logo} alt="University Logo" className="register-logo" />
          <h1 className="register-title">University Idea Management System</h1>
          <form onSubmit={handleRegister} className="register-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="fullName" placeholder="Enter your full name"
                className="form-input" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" name="email" placeholder="abc@university.edu"
                className="form-input" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select name="department" className="form-input form-select"
                onChange={handleChange} defaultValue="">
                <option value="" disabled>Select department</option>
                <option value="IT">Information Technology</option>
                <option value="Business">Business Administration</option>
                <option value="Design">Design & Arts</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">Human Resources</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input type={showPassword ? "text" : "password"} name="password"
                  placeholder="********" className="form-input password-input" onChange={handleChange} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle" aria-label="Toggle password visibility">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-input-wrapper">
                <input type={showConfirm ? "text" : "password"} name="confirmPassword"
                  placeholder="********" className="form-input password-input" onChange={handleChange} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="password-toggle" aria-label="Toggle password visibility">
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="terms-group">
              <input type="checkbox" name="agree" id="terms" onChange={handleChange} className="terms-checkbox" />
              <label htmlFor="terms" className="terms-label">I agree to the Terms & Conditions</label>
            </div>
            <button type="submit" className="register-button">Register</button>
            <div className="login-link">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/login")} className="link-button primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="vertical-separator" />
      <div className="register-illustration-section">
        <img src={illustration} alt="Illustration" className="illustration-image" />
      </div>
    </div>
  );
};

export default Register;
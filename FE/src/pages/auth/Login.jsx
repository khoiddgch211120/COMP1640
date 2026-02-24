import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notification } from "antd";
import "antd/dist/reset.css";

import illustration from "../../assets/Investment data-rafiki 1.png";
import logo from "../../assets/Logo.png";

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

      // 🔥 MOCK ROLE (Backend sau thay)
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

      // 🔥 Redirect theo role
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
    <div className="w-screen h-screen flex flex-col md:flex-row items-center justify-center bg-white font-[Cabin] overflow-hidden relative">
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col items-start px-8 sm:px-12 md:px-20">
        <div className="w-full max-w-[486px]">
          <img
            src={logo}
            alt="Logo"
            className="w-[180px] h-auto mb-6 md:mb-8"
          />

          <h2 className="text-[22px] sm:text-[26px] md:text-[30px] font-bold text-black mb-10 leading-snug">
            University Idea Management System
          </h2>

          <form className="w-full" onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-5">
              <label className="block text-[16px] font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abc@gmail.com"
                className="w-full h-[60px] border border-[#DEDDE4] rounded-md px-4 text-sm focus:ring-1 focus:ring-red-500 outline-none"
              />
            </div>

            {/* Password */}
            <div className="mb-6 relative">
              <label className="block text-[16px] font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full h-[60px] border border-[#DEDDE4] rounded-md px-4 pr-12 text-sm focus:ring-1 focus:ring-red-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[60px] bg-[#DC2626] hover:bg-[#b91c1c] text-white rounded-md font-semibold text-[16px] transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {/* Forgot password */}
            <div className="text-center mt-4">
  <button
    type="button"
    onClick={() => navigate("/forgot-password")}
    className="text-[#5D5A6F] text-[14px] hover:text-gray-700"
  >
    Quên mật khẩu?
  </button>
</div>

<div className="text-center text-[14px] text-[#5D5A6F] mt-2">
  Bạn không có tài khoản?{" "}
  <button
    type="button"
    onClick={() => navigate("/register")}
    className="text-[#DC2626] font-medium hover:underline"
  >
    Tạo 1 tài khoản
  </button>
</div>
          </form>
        </div>
      </div>

      {/* LINE */}
      <div
        className="hidden md:block h-[70%] w-[1.5px] mx-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(10, 3, 60, 0) 0%, #0A033C 51.56%, rgba(10, 3, 60, 0) 100%)",
        }}
      ></div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src={illustration}
          alt="Login Illustration"
          className="object-contain w-[70%]"
        />
      </div>
    </div>
  );
};

export default Login;
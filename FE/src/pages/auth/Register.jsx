import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import illustration from "../../assets/Investment data-rafiki 1.png";
import logo from "../../assets/Logo.png";
import { notification } from "antd";

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
    });

    navigate("/login");
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row items-center justify-center bg-white font-[Cabin] overflow-hidden">
      
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col items-start px-8 sm:px-12 md:px-20">
        <div className="w-full max-w-[486px]">

          <img
            src={logo}
            alt="Logo"
            className="w-[180px] h-auto mb-6"
          />

          <h2 className="text-[26px] font-bold text-black mb-8">
            University Idea Management System
          </h2>

          <form onSubmit={handleRegister}>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-[14px] font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                className="w-full h-[55px] border border-[#DEDDE4] rounded-md px-4 text-sm focus:ring-1 focus:ring-red-500 outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-[14px] font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="abc@university.edu"
                className="w-full h-[55px] border border-[#DEDDE4] rounded-md px-4 text-sm focus:ring-1 focus:ring-red-500 outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Department */}
            <div className="mb-4">
              <label className="block text-[14px] font-medium mb-2">
                Department
              </label>
              <select
                name="department"
                className="w-full h-[55px] border border-[#DEDDE4] rounded-md px-4 text-sm focus:ring-1 focus:ring-red-500 outline-none"
                onChange={handleChange}
              >
                <option value="">Select department</option>
                <option value="IT">IT</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="HR">HR</option>
              </select>
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <label className="block text-[14px] font-medium mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                className="w-full h-[55px] border border-[#DEDDE4] rounded-md px-4 pr-12 text-sm focus:ring-1 focus:ring-red-500 outline-none"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="mb-4 relative">
              <label className="block text-[14px] font-medium mb-2">
                Confirm Password
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="********"
                className="w-full h-[55px] border border-[#DEDDE4] rounded-md px-4 pr-12 text-sm focus:ring-1 focus:ring-red-500 outline-none"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-[42px] text-gray-500"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Terms */}
            <div className="mb-6 flex items-start gap-2">
              <input
                type="checkbox"
                name="agree"
                onChange={handleChange}
                className="mt-1"
              />
              <span className="text-sm text-gray-600">
                I agree to the Terms & Conditions
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full h-[55px] bg-[#DC2626] hover:bg-[#b91c1c] text-white rounded-md font-semibold text-[16px]"
            >
              Register
            </button>

            <div className="text-center mt-4 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#DC2626] font-medium hover:underline"
              >
                Login
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
          alt="Illustration"
          className="object-contain w-[70%]"
        />
      </div>
    </div>
  );
};

export default Register;
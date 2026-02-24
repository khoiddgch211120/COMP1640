import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import illustration from "../../assets/Investment data-rafiki 1.png";
import logo from "../../assets/Logo.png";

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

    // 🚀 Sau này thay bằng API call
    setLoading(true);

    setTimeout(() => {
      notification.success({
        message: "Reset link sent",
        description:
          "If this email exists, a password reset link has been sent.",
      });
      setLoading(false);
      navigate("/login");
    }, 1500);
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

          <h2 className="text-[26px] font-bold text-black mb-4">
            Reset Your Password
          </h2>

          <p className="text-sm text-gray-500 mb-8">
            Enter your university email address and we will send you a password reset link.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="mb-6">
              <label className="block text-[14px] font-medium mb-2">
                University Email
              </label>
              <input
                type="email"
                placeholder="abc@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[55px] border border-[#DEDDE4] rounded-md px-4 text-sm focus:ring-1 focus:ring-red-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-[55px] ${
                loading
                  ? "bg-gray-400"
                  : "bg-[#DC2626] hover:bg-[#b91c1c]"
              } text-white rounded-md font-semibold text-[16px]`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-black"
              >
                ← Back to Login
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

export default ForgotPassword;
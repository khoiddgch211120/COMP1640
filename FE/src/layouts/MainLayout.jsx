import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const MainLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const items = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}
      <Sidebar />

      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="h-16 bg-white border-b px-8 flex items-center justify-between">

          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              Enterprise Idea System
            </h1>
            <p className="text-xs text-slate-500">
              Manage and monitor innovation
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">
                {user?.fullName}
              </p>

              <p className="text-xs text-slate-500">
                {user?.role}
              </p>
            </div>

            <Dropdown menu={{ items }}>
              <Avatar
                size="large"
                className="bg-indigo-600 cursor-pointer"
                icon={<UserOutlined />}
              />
            </Dropdown>

          </div>

        </div>

        {/* CONTENT */}
        <div className="p-8 flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;
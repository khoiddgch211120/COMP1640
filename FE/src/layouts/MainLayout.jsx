import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const MainLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div className="font-semibold text-lg">
            Welcome, {user?.fullName}
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6 flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;
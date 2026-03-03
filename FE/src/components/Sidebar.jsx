import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES } from "../constants/roles";
import {
  BulbOutlined,
  PlusOutlined,
  BarChartOutlined,
  TeamOutlined,
  ApartmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);

  const baseClass =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all";

  const activeClass =
    "bg-indigo-100 text-indigo-700";

  const normalClass =
    "text-slate-600 hover:bg-slate-100";

  return (
    <div className="w-64 bg-white border-r min-h-screen flex flex-col">

      {/* LOGO / TITLE */}
      <div className="h-16 flex items-center px-6 border-b">
        <h2 className="text-lg font-semibold text-indigo-600">
          Idea System
        </h2>
      </div>

      {/* MENU */}
      <div className="flex-1 p-4 space-y-6">

        {/* STAFF */}
        {user?.role === ROLES.STAFF && (
          <div className="space-y-1">

            <p className="text-xs uppercase text-slate-400 px-2 mb-2">
              Staff
            </p>

            <NavLink
              to="/ideas"
              className={({ isActive }) =>
                `${baseClass} ${
                  isActive ? activeClass : normalClass
                }`
              }
            >
              <BulbOutlined />
              Idea List
            </NavLink>

            <NavLink
              to="/submit-idea"
              className={({ isActive }) =>
                `${baseClass} ${
                  isActive ? activeClass : normalClass
                }`
              }
            >
              <PlusOutlined />
              Submit Idea
            </NavLink>

          </div>
        )}

        {/* QA_COORDINATOR */}
        {user?.role === ROLES.QA_COORDINATOR && (
          <div className="space-y-1">

            <p className="text-xs uppercase text-slate-400 px-2 mb-2">
              QA Coordinator
            </p>

            <NavLink
              to="/ideas"
              className={({ isActive }) =>
                `${baseClass} ${
                  isActive ? activeClass : normalClass
                }`
              }
            >
              <BulbOutlined />
              Department Ideas
            </NavLink>

          </div>
        )}

        {/* QA_MANAGER */}
        {user?.role === ROLES.QA_MANAGER && (
          <div className="space-y-1">

            <p className="text-xs uppercase text-slate-400 px-2 mb-2">
              QA Manager
            </p>

            <NavLink
              to="/ideas"
              className={({ isActive }) =>
                `${baseClass} ${
                  isActive ? activeClass : normalClass
                }`
              }
            >
              <BulbOutlined />
              All Ideas
            </NavLink>

            <NavLink
              to="/statistics"
              className={({ isActive }) =>
                `${baseClass} ${
                  isActive ? activeClass : normalClass
                }`
              }
            >
              <BarChartOutlined />
              Statistics
            </NavLink>

          </div>
        )}

        {/* ADMIN */}
        {user?.role === ROLES.ADMIN && (
          <div className="space-y-1">

            <p className="text-xs uppercase text-slate-400 px-2 mb-2">
              Admin
            </p>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${baseClass} ${
                  isActive ? activeClass : normalClass
                }`
              }
            >
              <TeamOutlined />
              User Management
            </NavLink>

            <NavLink
              to="/admin/departments"
              className={({ isActive }) =>
                `${baseClass} ${
                  isActive ? activeClass : normalClass
                }`
              }
            >
              <ApartmentOutlined />
              Departments
            </NavLink>

            <NavLink
              to="/admin/academic-years"
              className={({ isActive }) =>
                `${baseClass} ${
                  isActive ? activeClass : normalClass
                }`
              }
            >
              <CalendarOutlined />
              Academic Years
            </NavLink>

          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="p-4 border-t text-xs text-slate-400 text-center">
        Enterprise Idea System v1.0
      </div>

    </div>
  );
};

export default Sidebar;
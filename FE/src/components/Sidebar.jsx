import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES } from "../constants/roles";

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);

  const linkClass =
    "block mb-3 px-3 py-2 rounded hover:bg-gray-200 transition";

  const activeClass = "bg-blue-500 text-white";

  return (
    <div className="w-64 bg-white shadow p-6">

      <h2 className="text-xl font-bold mb-6">Idea System</h2>

      {/* STAFF */}
      {user?.role === ROLES.STAFF && (
        <>
          <NavLink
            to="/ideas"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            Idea List
          </NavLink>

          <NavLink
            to="/submit-idea"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            Submit Idea
          </NavLink>
        </>
      )}

      {/* QA_COORDINATOR */}
      {user?.role === ROLES.QA_COORDINATOR && (
        <>
          <NavLink
            to="/ideas"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            Department Ideas
          </NavLink>
        </>
      )}

      {/* QA_MANAGER */}
      {user?.role === ROLES.QA_MANAGER && (
        <>
          <NavLink
            to="/ideas"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            All Ideas
          </NavLink>

          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            Statistics
          </NavLink>
        </>
      )}

      {/* ADMIN */}
      {user?.role === ROLES.ADMIN && (
        <>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            User Management
          </NavLink>

          <NavLink
            to="/admin/departments"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            Departments
          </NavLink>

          <NavLink
            to="/admin/academic-years"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            Academic Years
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Sidebar;
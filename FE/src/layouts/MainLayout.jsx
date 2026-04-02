import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { ROLES } from "../constants/roles";
import "../styles/main-layout.css";

// ── Nav items theo role ──────────────────────────────────────────────────────
const NAV_ITEMS_STAFF = [
  {
    key: "ideas",
    label: "Ideas",
    path: "/ideas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
        <line x1="9" y1="21" x2="15" y2="21"/>
        <line x1="10" y1="19" x2="14" y2="19"/>
      </svg>
    ),
  },
  {
    key: "submit-idea",
    label: "Submit Idea",
    path: "/submit-idea",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    ),
  },
  {
    key: "terms",
    label: "Terms",
    path: "/terms",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
];

const NAV_ITEMS_COORDINATOR = [
  {
    key: "ideas",
    label: "Ideas",
    path: "/ideas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
        <line x1="9" y1="21" x2="15" y2="21"/>
      </svg>
    ),
  },
  {
    key: "coordinator-dashboard",
    label: "Dashboard",
    path: "/coordinator/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    key: "coordinator-notifications",
    label: "Thông báo",
    path: "/coordinator/notifications",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
];

const NAV_ITEMS_QA_MANAGER = [
  {
    key: "ideas",
    label: "Ideas",
    path: "/ideas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3.5 6.5V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
        <line x1="9" y1="21" x2="15" y2="21"/>
      </svg>
    ),
  },
  {
    key: "statistics",
    label: "Statistics",
    path: "/statistics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    key: "categories",
    label: "Categories",
    path: "/manager/categories",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    key: "exceptions",
    label: "Exceptions",
    path: "/manager/exceptions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    key: "export",
    label: "Export Data",
    path: "/manager/export",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
  },
];

/* 🔥 FIX DUY NHẤT Ở ĐÂY */
function getNavItems(role) {
  switch (role) {
    case ROLES.QA_COORDINATOR:
      return NAV_ITEMS_COORDINATOR;

    case ROLES.QA_MANAGER:
      return NAV_ITEMS_QA_MANAGER;

    case ROLES.ACADEMIC:
    case ROLES.SUPPORT:
      return NAV_ITEMS_STAFF;

    default:
      return NAV_ITEMS_STAFF;
  }
}

// ── Component ────────────────────────────────────────────────────────────────
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const openModal = (path) => {
    navigate(path); // ❌ bỏ background
  };

  const displayName = user?.fullName || user?.full_name || "User";
  const displayInitial = displayName[0]?.toUpperCase() || "U";
  const displayRole = user?.role || user?.role_name || "";
  const navItems = getNavItems(displayRole);

  const dropdownItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div className={`main-layout${collapsed ? " sidebar-collapsed" : ""}`}>
      <aside className="main-sidebar">
        {/* UI giữ nguyên */}
        {/* ... (toàn bộ JSX của bạn không đổi) */}
        <nav className="main-sidebar-nav">
          {!collapsed && <span className="main-nav-section-label">NAVIGATION</span>}
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `main-nav-item${isActive ? " main-nav-item--active" : ""}`
              }
            >
              <span className="main-nav-icon">{item.icon}</span>
              {!collapsed && <span className="main-nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="main-header">
          <div className="header-right">
            {isAuthenticated ? (
              <Dropdown menu={{ items: dropdownItems }}>
                <Avatar icon={<UserOutlined />} />
              </Dropdown>
            ) : (
              <>
                <button onClick={() => openModal("/login")}>Đăng nhập</button>
                <button onClick={() => openModal("/register")}>Đăng ký</button>
              </>
            )}
          </div>
        </header>

        <main className="main-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
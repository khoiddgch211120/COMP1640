import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // ❌ Chưa login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Sai role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Nếu có children thì render children
  if (children) {
    return children;
  }

  // ✅ Nếu dùng nested route thì render Outlet
  return <Outlet />;
};

export default ProtectedRoute;
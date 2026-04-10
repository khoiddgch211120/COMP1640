import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Not authenticated -> redirect to login, save current URL for post-login redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Still loading user (edge case)
  if (!user) {
    return null;
  }

  // Authenticated but insufficient permissions -> 403, do NOT redirect to login
  // (avoids redirect loop and provides better UX)
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
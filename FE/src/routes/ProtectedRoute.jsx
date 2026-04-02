import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // ❗ chưa login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ❗ chưa load user xong → KHÔNG redirect
  if (!user) {
    return null; // hoặc loading
  }

  // ❗ check role
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />; // ❌ KHÔNG redirect về "/"
  }

  return children;
};

export default ProtectedRoute;
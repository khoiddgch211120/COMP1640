import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../constants/roles";
import ForgotPassword from "../pages/auth/ForgotPassword";
const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* STAFF */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
            <h1>Staff Dashboard</h1>
          </ProtectedRoute>
        }
      />

      {/* QA MANAGER */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={[ROLES.QA_MANAGER]}>
            <h1>QA Manager Dashboard</h1>
          </ProtectedRoute>
        }
      />

      {/* QA COORDINATOR */}
      <Route
        path="/coordinator"
        element={
          <ProtectedRoute allowedRoles={[ROLES.QA_COORDINATOR]}>
            <h1>QA Coordinator Dashboard</h1>
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <h1>Admin Panel</h1>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
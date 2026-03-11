import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../constants/roles";

// Admin
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import DepartmentManagement from "../pages/admin/DepartmentManagement";
import AcademicYearManagement from "../pages/admin/AcademicYearManagement";
import TermsConditions from "../pages/admin/TermsConditions";
import AttachmentManagement from "../pages/admin/AttachmentManagement";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* STAFF */}
      <Route path="/" element={<ProtectedRoute allowedRoles={[ROLES.STAFF]}><h1>Staff Dashboard</h1></ProtectedRoute>} />

      {/* QA MANAGER */}
      <Route path="/manager" element={<ProtectedRoute allowedRoles={[ROLES.QA_MANAGER]}><h1>QA Manager Dashboard</h1></ProtectedRoute>} />

      {/* QA COORDINATOR */}
      <Route path="/coordinator" element={<ProtectedRoute allowedRoles={[ROLES.QA_COORDINATOR]}><h1>QA Coordinator Dashboard</h1></ProtectedRoute>} />

      {/* ADMIN — nested routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard"      element={<AdminDashboard />} />
        <Route path="users"          element={<UserManagement />} />
        <Route path="departments"    element={<DepartmentManagement />} />
        <Route path="academic-years" element={<AcademicYearManagement />} />
        <Route path="terms"          element={<TermsConditions />} />
        <Route path="attachments"    element={<AttachmentManagement />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
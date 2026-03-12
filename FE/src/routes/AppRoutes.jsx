import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import { ROLES } from "../constants/roles";

// Idea system
import IdeaList from "../pages/ideas/IdeaList";
import SubmitIdea from "../pages/ideas/SubmitIdea";
import IdeaDetail from "../pages/ideas/IdeaDetail";
import Statistics from "../pages/statistics/Statistics";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersManagement from "../pages/admin/UsersManagement";
import DepartmentManagement from "../pages/admin/DepartmentManagement";
import AcademicYearManagement from "../pages/admin/AcademicYearManagement";
import TermsConditions from "../pages/admin/TermsConditions";
import AttachmentManagement from "../pages/admin/AttachmentManagement";

// Optional dashboards
const StaffDashboard = () => <h1>Staff Dashboard</h1>;
const ManagerDashboard = () => <h1>QA Manager Dashboard</h1>;
const CoordinatorDashboard = () => <h1>QA Coordinator Dashboard</h1>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* USER SYSTEM */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ideas"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.STAFF,
                ROLES.QA_COORDINATOR,
                ROLES.QA_MANAGER,
              ]}
            >
              <IdeaList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ideas/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.STAFF,
                ROLES.QA_COORDINATOR,
                ROLES.QA_MANAGER,
              ]}
            >
              <IdeaDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit-idea"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
              <SubmitIdea />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics"
          element={
            <ProtectedRoute allowedRoles={[ROLES.QA_MANAGER]}>
              <Statistics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={[ROLES.QA_MANAGER]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coordinator"
          element={
            <ProtectedRoute allowedRoles={[ROLES.QA_COORDINATOR]}>
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ADMIN SYSTEM */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersManagement />} />
        <Route path="/admin/departments" element={<DepartmentManagement />} />
        <Route path="/admin/academic-years" element={<AcademicYearManagement />} />
        <Route path="/admin/terms" element={<TermsConditions />} />
        <Route path="/admin/attachments" element={<AttachmentManagement />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../constants/roles";
import IdeaList from "../pages/ideas/IdeaList";
import SubmitIdea from "../pages/ideas/SubmitIdea";
import IdeaDetail from "../pages/ideas/IdeaDetail";
import Statistics from "../pages/statistics/Statistics";

// Temporary pages
const StaffDashboard = () => <h1>Staff Dashboard</h1>;
const ManagerDashboard = () => <h1>QA Manager Dashboard</h1>;
const CoordinatorDashboard = () => <h1>QA Coordinator Dashboard</h1>;
const AdminDashboard = () => <h1>Admin Dashboard</h1>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* PROTECTED SYSTEM */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* STAFF DASHBOARD */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* IDEA LIST */}
        <Route
          path="/ideas"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.STAFF,
                ROLES.QA_COORDINATOR,
                ROLES.QA_MANAGER
              ]}
            >
              <IdeaList />
            </ProtectedRoute>
          }
        />

        {/* IDEA DETAIL */}
        <Route
          path="/ideas/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROLES.STAFF,
                ROLES.QA_COORDINATOR,
                ROLES.QA_MANAGER
              ]}
            >
              <IdeaDetail />
            </ProtectedRoute>
          }
        />

        {/* SUBMIT IDEA - STAFF ONLY */}
        <Route
          path="/submit-idea"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
              <SubmitIdea />
            </ProtectedRoute>
          }
        />

        {/* QA MANAGER DASHBOARD */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={[ROLES.QA_MANAGER]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* 📊 STATISTICS - QA_MANAGER ONLY */}
        <Route
          path="/statistics"
          element={
            <ProtectedRoute allowedRoles={[ROLES.QA_MANAGER]}>
              <Statistics />
            </ProtectedRoute>
          }
        />

        {/* QA COORDINATOR */}
        <Route
          path="/coordinator"
          element={
            <ProtectedRoute allowedRoles={[ROLES.QA_COORDINATOR]}>
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
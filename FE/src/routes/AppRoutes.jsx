import { Routes, Route, Navigate } from "react-router-dom";

/* =========================
   AUTH PAGES
========================= */

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

/* =========================
   LAYOUTS
========================= */

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

/* =========================
   ROUTE GUARD
========================= */

import ProtectedRoute from "./ProtectedRoute";

/* =========================
   ROLES
========================= */

import { ROLES } from "../constants/roles";

/* =========================
   IDEA PAGES
========================= */

import IdeaList from "../pages/ideas/IdeaList";
import IdeaDetail from "../pages/ideas/IdeaDetail";
import SubmitIdea from "../pages/ideas/SubmitIdea";

/* =========================
   TERMS
========================= */

import TermsAccept from "../pages/terms/TermsAccept";

/* =========================
   STATISTICS
========================= */

import Statistics from "../pages/statistics/Statistics";

/* =========================
   ADMIN PAGES
========================= */

import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersManagement from "../pages/admin/UsersManagement";
import DepartmentManagement from "../pages/admin/DepartmentManagement";
import AcademicYearManagement from "../pages/admin/AcademicYearManagement";
import TermsConditions from "../pages/admin/TermsConditions";
import AttachmentManagement from "../pages/admin/AttachmentManagement";

/* =========================
   COORDINATOR
========================= */

import CoordinatorDashboard from "../pages/coordinator/CoordinatorDashboard";

const AppRoutes = () => {
  return (
    <Routes>

      {/* =========================
         PUBLIC ROUTES
      ========================= */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      {/* =========================
         MAIN LAYOUT
      ========================= */}

      <Route element={<MainLayout />}>

        <Route path="/" element={<IdeaList />} />

        <Route path="/ideas" element={<IdeaList />} />

        <Route path="/ideas/:id" element={<IdeaDetail />} />


        {/* STAFF SUBMIT IDEA */}

        <Route
          path="/submit-idea"
          element={
            <ProtectedRoute roles={[ROLES.STAFF]}>
              <SubmitIdea />
            </ProtectedRoute>
          }
        />


        {/* TERMS */}

        <Route
          path="/terms"
          element={
            <ProtectedRoute roles={[ROLES.STAFF]}>
              <TermsAccept />
            </ProtectedRoute>
          }
        />


        {/* COORDINATOR DASHBOARD */}

        <Route
          path="/coordinator/dashboard"
          element={
            <ProtectedRoute roles={[ROLES.QA_COORDINATOR]}>
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />


        {/* QA MANAGER STATISTICS */}

        <Route
          path="/statistics"
          element={
            <ProtectedRoute roles={[ROLES.QA_MANAGER]}>
              <Statistics />
            </ProtectedRoute>
          }
        />

      </Route>


      {/* =========================
         ADMIN LAYOUT
      ========================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        <Route index element={<AdminDashboard />} />

        <Route path="users" element={<UsersManagement />} />

        <Route path="departments" element={<DepartmentManagement />} />

        <Route path="academic-years" element={<AcademicYearManagement />} />

        <Route path="terms" element={<TermsConditions />} />

        <Route path="attachments" element={<AttachmentManagement />} />

      </Route>


      {/* =========================
         FALLBACK
      ========================= */}

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
};

export default AppRoutes;
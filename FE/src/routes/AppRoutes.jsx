import { Routes, Route, Navigate, useLocation } from "react-router-dom";

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
   QA MANAGER PAGES
========================= */
import CategoryManagement from "../pages/manager/CategoryManagement";
import ExceptionReports from "../pages/manager/ExceptionReports";
import ExportData from "../pages/manager/ExportData";

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
import CoordinatorDashboard      from "../pages/coordinator/CoordinatorDashboard";
import CoordinatorNotifications  from "../pages/coordinator/CoordinatorNotifications";

const AppRoutes = () => {
  const location = useLocation();
  /**
   * `background` tồn tại khi người dùng navigate tới auth route
   * kèm state: { background: currentLocation }.
   * Khi đó:
   *  - <Routes location={background}> → render trang nền (giữ nguyên layout)
   *  - Routes thứ hai → render auth page dưới dạng modal nổi lên trên
   */
  const background = location.state?.background;

  return (
    <>
      {/* ── BACKGROUND (hoặc toàn trang nếu không có modal) ── */}
      <Routes location={background || location}>

        {/* ── MAIN LAYOUT ── */}
        <Route element={<MainLayout />}>

          <Route path="/"          element={<IdeaList />} />
          <Route path="/ideas"     element={<IdeaList />} />
          <Route path="/ideas/:id" element={<IdeaDetail />} />

          <Route
            path="/submit-idea"
            element={
              <ProtectedRoute roles={[ROLES.STAFF]}>
                <SubmitIdea />
              </ProtectedRoute>
            }
          />

          <Route
            path="/terms"
            element={
              <ProtectedRoute roles={[ROLES.STAFF]}>
                <TermsAccept />
              </ProtectedRoute>
            }
          />

          <Route
            path="/coordinator/dashboard"
            element={
              <ProtectedRoute roles={[ROLES.QA_COORDINATOR]}>
                <CoordinatorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/coordinator/notifications"
            element={
              <ProtectedRoute roles={[ROLES.QA_COORDINATOR]}>
                <CoordinatorNotifications />
              </ProtectedRoute>
            }
          />

          {/* QA Manager routes */}
          <Route
            path="/statistics"
            element={
              <ProtectedRoute roles={[ROLES.QA_MANAGER]}>
                <Statistics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/categories"
            element={
              <ProtectedRoute roles={[ROLES.QA_MANAGER]}>
                <CategoryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/exceptions"
            element={
              <ProtectedRoute roles={[ROLES.QA_MANAGER]}>
                <ExceptionReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/export"
            element={
              <ProtectedRoute roles={[ROLES.QA_MANAGER]}>
                <ExportData />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* ── ADMIN LAYOUT ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index                 element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"      element={<AdminDashboard />} />
          <Route path="users"          element={<UsersManagement />} />
          <Route path="departments"    element={<DepartmentManagement />} />
          <Route path="academic-years" element={<AcademicYearManagement />} />
          <Route path="terms"          element={<TermsConditions />} />
          <Route path="attachments"    element={<AttachmentManagement />} />
        </Route>

        {/* ── AUTH ROUTES (toàn trang — khi truy cập trực tiếp qua URL) ── */}
        {/*
            Các route này được dùng khi:
            - Người dùng gõ thẳng URL /login, /register, /forgot-password
            - Không có background state → render full-page như cũ
        */}
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ── FALLBACK ── */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      {/* ── MODAL ROUTES (chỉ render khi có background state) ── */}
      {/*
          isModal=true → auth page render dưới dạng overlay modal
          Trang nền (layout) vẫn hiển thị phía sau nhờ Routes đầu tiên
          dùng location={background}.
      */}
      {background && (
        <Routes>
          <Route path="/login"           element={<Login isModal />} />
          <Route path="/register"        element={<Register isModal />} />
          <Route path="/forgot-password" element={<ForgotPassword isModal />} />
        </Routes>
      )}
    </>
  );
};

export default AppRoutes;
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <AdminHeader />

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>

      {/* FOOTER */}
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
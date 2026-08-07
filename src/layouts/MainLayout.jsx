import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import UploadStatusBadge from "../components/upload/UploadStatusBadge";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <UploadStatusBadge />
    </div>
  );
}

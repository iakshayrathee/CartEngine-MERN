"use client";

import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openSidebar &&
        !event.target.closest('[data-sidebar="sidebar"]') &&
        !event.target.closest('[data-sidebar="trigger"]')
      ) {
        setOpenSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSidebar]);

  // Close sidebar when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpenSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      {/* Admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Admin header */}
        <AdminHeader setOpen={setOpenSidebar} />

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b p-4 md:p-6">
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.userName || "Admin"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your store today
          </p>
        </div>

        {/* Main content area */}
        <main className="flex-1 flex-col flex p-4 md:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Mobile overlay */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setOpenSidebar(false)}
        />
      )}
    </div>
  );
}

export default AdminLayout;

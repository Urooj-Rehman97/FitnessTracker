// src/layouts/DashboardLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "../dashboard/Sidebar";
import useAuth from "../../../hooks/useAuth";
import PageTransition from "../PageTransition";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useAuth();

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });
    socket.on("connect", () => socket.emit("join", user._id));
    socket.on("receive-notification", (notif) => {
      toast.custom(
        (t) => (
          <div
            className={`bg-surface-card p-4 rounded-lg shadow-lg border border-border-card ${
              t.visible ? "animate-enter" : "animate-leave"
            }`}
          >
            <p className="font-bold text-brand-primary">{notif.title}</p>
            <p className="text-sm text-text-base">{notif.message}</p>
          </div>
        ),
        { duration: 5000 }
      );
    });
    return () => socket.disconnect();
  }, [user?._id]);

  return (
    <div className="flex min-h-screen bg-surface-background text-text-base overflow-x-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          sidebarOpen && !isMobile ? "md:ml-64" : "md:ml-20"
        }`}
      >
        {/* HAMBURGER ICON — SIRF JAB SIDEBAR BAND HO! */}
        {isMobile && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 bg-surface-card rounded-lg shadow-md hover:bg-surface-hover"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6 text-text-base"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-6">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
      </div>

      <Toaster position="top-center" />
    </div>
  );
}

// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Bell, X, Menu } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useNotifications from "../../../hooks/useNotifications";

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications(
    user?._id
  );
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-surface-card border-b border-border-card px-4 md:px-6 py-5">
      <div className="flex items-center justify-between">
        {/* Left: Hamburger (Mobile) + Title (Hidden on Mobile) */}
        <div className="flex items-center gap-3">
          {/* Title - Hidden on mobile */}
          <h1 className="hidden md:block text-lg md:text-xl font-semibold text-brand-primary">
            {user?.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Profile */}
          <div className="flex items-center gap-2 md:gap-3">
            <img
              src={user?.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-brand-primary"
            />
            <span className="hidden md:block text-sm font-medium text-text-base">
              {user?.username}
            </span>
          </div>

          {/* Bell */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="relative p-2 rounded-full hover:bg-surface-hover transition-all"
              title="Notifications"
            >
              <Bell size={22} className="text-text-base" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-surface-card rounded-lg shadow-2xl border border-border-card z-50">
                <div className="p-3 border-b border-border-card flex justify-between items-center">
                  <h3 className="font-bold text-text-base">Notifications</h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 hover:bg-surface-hover rounded"
                  >
                    <X size={16} className="text-text-muted" />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-text-muted italic">
                      No notifications yet
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => markAsRead(notif._id)}
                        className={`p-3 border-b border-border-card cursor-pointer transition-all ${
                          notif.isRead
                            ? "opacity-50 bg-surface-card-alt"
                            : "bg-surface-hover hover:bg-surface-card-alt"
                        }`}
                      >
                        <p className="font-medium text-brand-primary text-sm md:text-base">
                          {notif.title}
                        </p>
                        <p className="text-xs md:text-sm text-text-base">
                          {notif.message}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// src/components/layout/Sidebar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Activity,
  User,
  BarChart3,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Salad,
  TrendingUp,
  BarChart,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import useAuth from "../../../hooks/useAuth";
import { logoutUser } from "../../../app/slices/authSlice";

import Logo_Icon from "../../../assets/Logos/logo.png"


/* ================= MENU ================= */
const MENU = {
  admin: [
    { name: "Dashboard", path: "/admin-dashboard", icon: "BarChart3" },
    { name: "Users", path: "/admin/users", icon: "Users" },
    { name: "Products", path: "/admin/products", icon: "FileText" },
        { name: "Profile", path: "/admin/profile", icon: "User" }
        
  ],
  user: [
    { name: "Overview", path: "/dashboard", icon: "Home" },
    { name: "Workouts", path: "/dashboard/workouts", icon: "Activity" },
    { name: "Nutrition", path: "/dashboard/meal", icon: "Salad" },
    { name: "Progress", path: "/dashboard/progress", icon: "TrendingUp" },
    { name: "Analytics", path: "/dashboard/analytics", icon: "BarChart" },
    { name: "Settings", path: "/dashboard/settings", icon: "Settings" },
  ],
};

/* ================= ICON MAP ================= */
const ICONS = {
  Home: <Home className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Salad: <Salad className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  BarChart: <BarChart className="w-5 h-5" />,
};

export default function Sidebar({ isOpen, setIsOpen, isMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const role = user?.role ?? "user";
  const items = MENU[role];

  /* ================= LIVE TIME ================= */
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Karachi",
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate("/login");
  };

  /* ================= MOBILE OUTSIDE CLICK ================= */
  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const close = (e) => {
      if (!e.target.closest("aside")) setIsOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [isOpen, isMobile, setIsOpen]);

  return (
    <>
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30" />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col
          bg-surface-card border-r border-border-card
          text-text-base font-body
          transition-all duration-300
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
          ${isOpen ? "w-64" : "w-20"}
        `}
      >
        {!isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -right-3 top-6 h-8 w-8 rounded-full
            bg-surface-card-alt border border-border-card
            flex items-center justify-center"
          >
            <ChevronLeft
              className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        )}

        {/* LOGO */}
        <div className="mt-6 flex items-center gap-3 px-4">
          <div className="h-9 w-9 rounded-full border-avatar-border overflow-hidden">
            <img
              src={Logo_Icon}
              className="h-full w-full object-cover"
              alt="FitX Logo"
            />
          </div>
          {isOpen && (
            <span className="text-xl font-heading text-brand-primary">
              Fit X
            </span>
          )}
        </div>


        {/* USER INFO */}
        {isOpen && (
          <div className="mt-4 px-4 text-xs text-text-muted space-y-1">
            <div className="flex gap-2">
              <Clock className="w-4 h-4" /> {currentTime} PKT
            </div>
            <div className="flex gap-2">
              <MapPin className="w-4 h-4" /> Pakistan
            </div>
          </div>
        )}

        {/* NAV */}
        <nav className="mt-6 flex-1 px-3 space-y-1">
          {items.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-lg py-2.5
                  ${isOpen ? "px-3 gap-3" : "justify-center"}
                  ${active
                    ? "bg-brand-primary text-white"
                    : "text-text-muted hover:bg-surface-hover"
                  }
                `}
              >
                {ICONS[item.icon]}
                {isOpen && item.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="m-2 rounded-lg py-2 flex items-center justify-center
          text-error hover:bg-error/10"
        >
          <LogOut className="h-5 w-5" />
          {isOpen && <span className="ml-2">Logout</span>}
        </button>
      </aside>
    </>
  );
}

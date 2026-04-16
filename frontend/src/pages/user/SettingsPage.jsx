// src/pages/user/SettingsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import FeedbackModal from "../../components/feedback/FeedbackModal.jsx";
import axiosInstance from "../../utils/axiosInstance";
import {
  Moon,
  Sun,
  Bell,
  BellOff,
  Save,
  Weight,
  Edit,
  Key,
  Trash2,
  MessageCircle,
  FileText,
  Shield,
  ExternalLink,
  BellOffIcon,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("notifications") === "true" || true
  );
  const [unitSystem, setUnitSystem] = useState(
    () => localStorage.getItem("units") || "metric"
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete("/api/auth/delete-account", {
        withCredentials: true,
      });

      setShowDeleteModal(false);
      setShowSuccessModal(true);

      localStorage.clear();
      sessionStorage.clear();

      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      toast.error("Failed to delete account. Try again.");
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      axiosInstance
        .post(`${API_URL}/api/auth/preferences`, {
          notifications,
          units: unitSystem,
          theme,
        })
        .catch(() => {});
    }
  }, [notifications, unitSystem, theme, user]);

  const saveSettings = () => {
    localStorage.setItem("notifications", notifications);
    localStorage.setItem("units", unitSystem);
    toast.success("All settings saved!", {
      icon: <CheckCircle size={20} />,
      duration: 3000,
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const openFeedbackModal = () => setFeedbackOpen(true);

  const legalLinks = [
    {
      icon: MessageCircle,
      title: "Feedback & Support",
      desc: "Send feedback or get help",
      onClick: openFeedbackModal,
    },
    {
      icon: FileText,
      title: "Terms & Conditions",
      desc: "Read our terms of service",
      link: "/legal/terms",
    },
    {
      icon: Shield,
      title: "Privacy Policy",
      desc: "How we protect your data",
      link: "/legal/privacy",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-page p-6 md:p-8">
      <div className=" mx-auto space-y-10">
        {/* Profile Section */}
        <div className="bg-surface-card border border-border-card rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-black text-text-base mb-8">
            Your Profile
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full border-4 border-brand-primary overflow-hidden bg-surface-card-alt shadow-2xl">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-brand-primary to-brand-secondary">
                    <span className="text-6xl font-black text-black">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-base">
                  {user?.username || "Fitness Beast"}
                </h3>
                <p className="text-text-muted ">
                  {user?.email || "user@beastmode.com"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto">
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="px-8 py-4 bg-brand-primary text-black font-bold rounded-xl hover:bg-brand-secondary transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Edit size={22} /> Edit Profile
              </button>
              <button
                onClick={() => navigate("/forgot-password")}
                className="px-8 py-4 bg-surface-hover text-text-base font-medium rounded-xl hover:bg-surface-card-alt transition-all flex items-center justify-center gap-3"
              >
                <Key size={22} /> Change Password
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="mt-10 w-full py-5 bg-error text-white font-black rounded-xl hover:bg-red-700 transition-all  flex items-center justify-center gap-3 shadow-lg"
          >
            <Trash2 size={24} /> Delete Account Permanently
          </button>
        </div>

        {/* Preferences Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Theme */}
          <div className="bg-surface-card border border-border-card rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-text-base mb-6 flex items-center gap-3">
              <Moon size={24} /> Appearance
            </h3>
            <div className="flex items-center justify-between">
              <span className=" font-medium capitalize">{theme} Mode</span>
              <button
                onClick={toggleTheme}
                className={`relative w-16 h-9 rounded-full transition-all ${
                  theme === "dark" ? "bg-brand-primary" : "bg-brand-secondary"
                }`}
              >
                <div
                  className={`absolute top-1 w-7 h-7 bg-surface-page rounded-full shadow-xl transition-transform ${
                    theme === "light" ? "translate-x-8" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Units */}
          <div className="bg-surface-card border border-border-card rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-text-base mb-6 flex items-center gap-3">
              <Weight size={24} /> Units
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {["metric", "imperial"].map((unit) => (
                <button
                  key={unit}
                  onClick={() => setUnitSystem(unit)}
                  className={`py-4 rounded-xl font-bold  transition-all ${
                    unitSystem === unit
                      ? "bg-brand-primary text-black shadow-lg"
                      : "bg-surface-card-alt text-text-muted hover:bg-surface-hover"
                  }`}
                >
                  {unit === "metric" ? "kg/cm" : "lbs/ft"}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-surface-card border border-border-card rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-text-base mb-6 flex items-center gap-3">
              {notifications ? <Bell size={24} /> : <BellOffIcon size={24} />}
              Notifications
            </h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className=" font-medium">Push Alerts</span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-16 h-9 rounded-full transition-all ${
                  notifications ? "bg-brand-primary" : "bg-surface-card-alt"
                }`}
              >
                <div
                  className={`absolute top-1 w-7 h-7 bg-surface-page rounded-full shadow-xl transition-transform ${
                    notifications ? "translate-x-8" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* Support & Legal Section */}
        <div className="bg-surface-card border border-border-card rounded-2xl p-10 shadow-xl">
          <h3 className="text-3xl font-black text-center text-brand-primary mb-10">
            Support & Legal
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {legalLinks.map(({ icon: Icon, title, desc, link, onClick }) => (
              <button
                key={title}
                onClick={onClick || (() => link && navigate(link))}
                className="group bg-surface-card-alt border border-border-card rounded-2xl p-8 hover:bg-surface-card-alt/50 hover:border-brand-primary/50 transition-all hover:scale-105 shadow-lg text-left"
              >
                <div className="flex items-center justify-between mb-6">
                  <Icon
                    size={40}
                    className="text-brand-primary group-hover:text-brand-secondary transition"
                  />
                  <ExternalLink
                    size={20}
                    className="text-text-muted opacity-0 group-hover:opacity-100 transition"
                  />
                </div>
                <h4 className="text-2xl font-bold text-text-base mb-3">
                  {title}
                </h4>
                <p className="text-text-muted">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-10">
          <button
            onClick={saveSettings}
            className="px-12 py-6 bg-linear-to-r from-brand-primary to-brand-tertiary text-black text-2xl font-bold rounded-2xl hover:scale-102 transition-all shadow-2xl flex items-center gap-5 cursor-pointer"
          >
            <Save size={40} />
            Save All Settings
          </button>
        </div>
        <FeedbackModal
          isOpen={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
        />
        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
            <div className="bg-surface-card rounded-3xl p-10 max-w-lg w-full border-4 border-error/50 shadow-2xl">
              <h2 className="text-4xl font-black text-error mb-6 text-center">
                Delete Account?
              </h2>
              <p className="text-xl text-text-base text-center mb-10">
                This action{" "}
                <span className="text-error font-black">cannot be undone</span>.
                <br />
                All your data will be lost forever.
              </p>
              <div className="flex gap-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-5 bg-surface-hover rounded-2xl font-bold text-xl hover:bg-surface-card-alt transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-5 bg-error text-white rounded-2xl font-bold text-xl hover:bg-red-700 transition"
                >
                  Yes, Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
            <div className="bg-surface-card rounded-3xl p-16 text-center border-4 border-error/50 shadow-2xl animate-pulse">
              <Trash2 size={80} className="text-error mx-auto mb-8" />
              <h2 className="text-5xl font-black text-error mb-6">
                Account Deleted
              </h2>
              <p className="text-2xl text-text-base mb-4">
                Your journey ends here.
              </p>
              <p className="text-xl text-text-muted">Redirecting to login...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

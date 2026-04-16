// src/App.jsx → FINAL VERSION
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

import PublicLayout from "./components/layout/PublicLayout";
import Home from "./pages/public/Home";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";
import VerifyEmail from "./pages/public/VerifyEmail";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import Features from "./pages/public/Features";
import About from "./pages/public/About";
import Demo from "./pages/public/Demo";
import TermsAndConditions from "./pages/public/TermsAndConditions";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import PurchaseProduct from "./pages/public/PurchaseProduct"; 
import ProductDetail from "./pages/public/ProductDetail"; 
import PaymentSuccess from "./pages/public/PaymentSuccess";
import UserDashboard from "./pages/user/userDashboard";
import Profile from "./pages/user/Profile";
import WorkoutsList from "./pages/user/WorkoutList";
import StartWorkout from "./pages/user/StartWorkout";
import NutritionPage from "./pages/user/nutritions/NutritionPage";
import ProgressPage from "./pages/user/progress/ProgressPage";
import AnalyticsPage from "./pages/user/AnalyticsPage";
import SettingsPage from "./pages/user/SettingsPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminProducts from "./pages/admin/AdminProducts";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import DashboardLayout from "./components/layout/dashboard/DashboardLayout";

import ScrollToTop from "./utils/ScrollToTop";
import { useEffect, useState } from "react";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ================== Public Routes ================== */}
        <Route path="/" element={<PublicLayout key="home"><Home /></PublicLayout>} />
        <Route path="/features" element={<PublicLayout key="features"><Features /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout key="about"><About /></PublicLayout>} />
        <Route path="/demo" element={<PublicLayout><Demo /></PublicLayout>} />

        {/* ✅ Store Page */}
        <Route path="/purchase-products" element={<PublicLayout><PurchaseProduct /></PublicLayout>} />
        <Route
          path="/product/:id"
          element={
            <PublicLayout>
              <ProductDetail />
            </PublicLayout>
          }
        />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<div className="text-white pt-40 text-center">Payment Cancelled.</div>} />

        {/* Auth */}
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Legal */}
        <Route path="/legal/terms" element={<TermsAndConditions />} />
        <Route path="/legal/privacy" element={<PrivacyPolicy />} />

        {/* ================== Protected User Routes ================== */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/workouts" element={<WorkoutsList />} />
          <Route path="/dashboard/start/:id" element={<StartWorkout />} />
          <Route path="/dashboard/meal" element={<NutritionPage />} />
          <Route path="/dashboard/progress" element={<ProgressPage />} />
          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Route>

        {/* ================== Admin Routes ================== */}
        <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/profile" element={<Profile />} />
        </Route>

        {/* ================== Fallback Route ================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;

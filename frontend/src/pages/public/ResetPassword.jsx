// src/pages/public/ResetPassword.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const schema = yup.object({
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm password is required"),
});

const API_URL = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_URL}/api/auth/reset-password/${token}`, {
        password: data.password,
      });
      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-surface-background flex items-center justify-center p-4">
      <div className="bg-surface-card rounded-2xl p-8 w-full max-w-md shadow-xl border border-border-card">
        <h2 className="text-3xl font-bold text-brand-primary text-center mb-6">
          Set New Password
        </h2>
        <p className="text-text-muted text-center mb-6 text-sm">
          Enter a strong new password for your account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* New Password */}
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="w-full p-3 pr-12 rounded-md bg-surface-card-alt border border-border-card text-text-base placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-primary"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              className="w-full p-3 pr-12 rounded-md bg-surface-card-alt border border-border-card text-text-base placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-primary"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-primary text-white font-bold rounded-md hover:bg-brand-secondary disabled:bg-surface-hover disabled:text-text-muted disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-text-muted mt-6 text-sm">
          <Link to="/login" className="text-brand-primary hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
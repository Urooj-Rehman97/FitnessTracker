// src/pages/public/ForgotPassword.jsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const schema = yup.object({
  email: yup.string().trim().email("Invalid email").required("Email is required"),
});

const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, data);
      toast.success("Reset link sent! Check your email.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen bg-surface-background flex items-center justify-center p-4">
      <div className="bg-surface-card rounded-2xl p-8 w-full max-w-md shadow-xl border border-border-card">
        <h2 className="text-3xl font-bold text-brand-primary text-center mb-6">
          Forgot Password?
        </h2>
        <p className="text-text-muted text-center mb-6 text-sm">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              className="w-full p-3 rounded-md bg-surface-card-alt border border-border-card text-text-base placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-primary text-white font-bold rounded-md hover:bg-brand-secondary disabled:bg-surface-hover disabled:text-text-muted disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-text-muted mt-6 text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-brand-primary hover:underline font-medium">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
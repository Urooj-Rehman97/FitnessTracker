// src/pages/public/Login.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../app/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  rememberMe: yup.boolean(),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);
  const { user, redirectPath } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { rememberMe: true },
  });

  useEffect(() => {
    if (user && redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, redirectPath, navigate]);

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-surface-background flex items-center justify-center p-4">
      <div className="bg-surface-card rounded-2xl p-8 w-full max-w-md shadow-xl border border-border-card">
        <h2 className="text-3xl font-bold text-brand-primary text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-md bg-surface-card-alt border border-border-card text-text-base placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-12 rounded-md bg-surface-card-alt border border-border-card text-text-base placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-primary transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-text-muted">
              <input
                {...register("rememberMe")}
                type="checkbox"
                className="mr-2 accent-brand-primary"
                disabled={loading}
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-brand-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="w-full py-3 bg-brand-primary text-white font-bold rounded-md hover:bg-brand-secondary disabled:bg-surface-hover disabled:text-text-muted disabled:cursor-not-allowed transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && !errors.email && !errors.password && (
          <p className="text-error text-center mt-4 text-sm">{error}</p>
        )}

        <p className="text-center text-text-muted mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
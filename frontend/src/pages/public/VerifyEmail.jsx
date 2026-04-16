// src/pages/public/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axiosInstance.get(`/api/auth/verify-email/${token}`, {
          signal: controller.signal,
        });

        if (isMounted) {
          setStatus("success");
          setMessage(res.data.message || "Email verified successfully!");
          setTimeout(() => {
            if (isMounted) navigate("/login");
          }, 3000);
        }
      } catch (error) {
        if (error.name === "CanceledError") return;
        if (isMounted) {
          console.error("Verification failed:", error);
          const msg = error.response?.data?.message || "Invalid or expired token.";
          setStatus("error");
          setMessage(msg);
        }
      }
    };

    verifyEmail();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-surface-background flex items-center justify-center p-4">
      <div className="bg-surface-card p-8 rounded-xl shadow-xl max-w-md w-full border border-border-card">
        <div className="text-center space-y-4">
          {/* ICON */}
          <div className="flex justify-center">
            {status === "loading" && (
              <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="w-12 h-12 text-success" />
            )}
            {status === "error" && <XCircle className="w-12 h-12 text-error" />}
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-text-highlight">
            {status === "loading" && "Verifying Your Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </h2>

          {/* MESSAGE */}
          <p className="text-text-base">{message}</p>

          {/* SUCCESS: Auto redirect */}
          {status === "success" && (
            <p className="text-sm text-text-muted">
              Redirecting to login in 3 seconds...
            </p>
          )}

          {/* ERROR: Manual retry */}
          {status === "error" && (
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-2 bg-button-primary text-text-inverted rounded-lg font-medium hover:opacity-90 transition"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
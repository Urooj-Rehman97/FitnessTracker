// src/hooks/useProgress.js
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

export default function useProgress() {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  const [progress, setProgress] = useState([]);
  const [latest, setLatest] = useState({});
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract userId to avoid changing dependency array length
  const userId = user?._id;

  const fetchProgress = useCallback(async () => {
    if (!userId) return; // safety check

    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get("/api/progress");

      const progressArray = Array.isArray(data) ? data : [];
      const sortedProgress = progressArray.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      const newestProgress = sortedProgress[sortedProgress.length - 1] || {};

      setProgress(sortedProgress);
      setLatest(newestProgress);
      setTrend(data.trend || null);
    } catch (err) {
      console.error("Fetch error:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch progress";
      setError(message);
      if (err.response?.status !== 404) toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const logProgress = async (data) => {
    if (!userId) {
      toast.error("User not logged in!");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/progress", data);
      const newProgress = res.data.progress;

      const updated = [...progress, newProgress].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setProgress(updated);
      setLatest(updated[updated.length - 1] || {});
      setTrend(res.data.trend || null);

      toast.success("Progress logged! Goal updated.");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to log progress";
      toast.error(message);
    }
  };

  const recentProgress = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return progress.filter((p) => new Date(p.date) >= cutoff);
  }, [progress]);

  // Fetch progress once user exists and auth loading is complete
  useEffect(() => {
    if (!authLoading && userId) {
      fetchProgress();
    }
  }, [authLoading, userId, fetchProgress]);

  return {
    progress,
    latest,
    trend,
    loading: loading || authLoading, // show spinner until auth is ready
    error,
    logProgress,
    fetchProgress,
    recentProgress,
  };
}

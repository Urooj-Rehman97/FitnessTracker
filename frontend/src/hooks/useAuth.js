// src/hooks/useAuth.js
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loginUser } from "../app/slices/authSlice";
import { setUser } from "../app/slices/authSlice";

const API_URL = import.meta.env.VITE_API_URL;

const getRedirectPath = (role) =>
  role === "admin" ? "/admin-dashboard" : "/dashboard";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false);
  useEffect(() => {
    // Only check session if not already logged in
    if (user) {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      hasChecked.current = true;
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        const loggedInUser = res.data.user;
        const syncPref = (key, value) => {
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, value);
          }
        };

        syncPref(
          "notifications",
          loggedInUser.preferences?.notifications ?? true
        );
        syncPref("units", loggedInUser.preferences?.units ?? "metric");
        syncPref("theme", loggedInUser.preferences?.theme ?? "dark");
        dispatch(setUser(loggedInUser));
      } catch (err) {
        // 401 is expected → not logged in
        console.log("Not logged in (401 expected on public pages)");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [dispatch, user]);

  return {
    user,
    loading,
    redirectPath: user ? getRedirectPath(user.role) : null,
  };
}

// frontend/src/hooks/useNotifications.js
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export default function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
      credentials: "include"
    });
    const data = await res.json();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  };

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();

    const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });
    socket.emit("join", userId);

    socket.on("receive-notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(c => c + 1);
    });

    return () => socket.disconnect();
  }, [userId]);

  const markAsRead = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`, {
      method: "PATCH",
      credentials: "include"
    });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  return { notifications, unreadCount, markAsRead, refetch: fetchNotifications };
}
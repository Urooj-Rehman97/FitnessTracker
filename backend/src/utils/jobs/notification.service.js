// backend/services/notification.service.js
import Notification from "../../models/Notification.js";
import User from "../../models/User.js";

export const createNotification = async (userId, data) => {
  try {
    // ✅ Fetch the user to check preferences
    const user = await User.findById(userId).select("username preferences");

    if (!user) {
      console.warn(`User not found for notification: ${userId}`);
      return null;
    }

    // 🚫 Stop if user has turned off notifications
    if (user?.preferences?.notifications === false) {
      console.log(
        `Notifications disabled — skipping for user: ${user.username} (${userId})`
      );
      return null;
    }
    const notif = await Notification.create({
      user: userId,
      title: data.title,
      message: data.message,
      type: data.type,
      workout: data.workoutId || null,
    });

    // Send via socket if online
    const socketId = global.userSockets[userId.toString()];
    if (socketId && global.io) {
      global.io.to(socketId).emit("receive-notification", {
        _id: notif._id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        workoutId: notif.workout,
        createdAt: notif.createdAt,
        isRead: false,
      });
    }

    return notif;
  } catch (error) {
    console.error("❌ Error creating notification:", error.message);
    return null;
  }
};

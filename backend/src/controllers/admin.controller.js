// controllers/admin.controller.js

import User from "../models/User.js";
import Workout from "../models/Workout.js";
import Notification from "../models/Notification.js";
import Nutrition from "../models/Nutrition.js";
import Progress from "../models/Progress.js";
import { adminEmailupdates } from "../utils/emailTemplates/adminEmailupdates.js";

// 1. GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 2. GET SINGLE USER (VIEW PROFILE)
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Basic User Data
    const user = await User.findById(userId).select(
      "-password -verificationToken -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Count All Related Data in Parallel (Super Fast!)
    const [workoutCount, progressCount, nutritionCount] = await Promise.all([
      Workout.countDocuments({ user: userId }),
      Progress.countDocuments({ user: userId }),
      Nutrition.countDocuments({ user: userId }),
    ]);

    // 3. Optional: Latest Activity (Last workout or nutrition or progress)
    const latestActivity = await Promise.all([
      Workout.findOne({ user: userId }).sort({ date: -1 }).select("date"),
      Nutrition.findOne({ user: userId }).sort({ date: -1 }).select("date"),
      Progress.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .select("createdAt"),
    ]);

    const dates = latestActivity
      .filter((item) => item)
      .map((item) => item.date || item.createdAt)
      .filter(Boolean);

    const lastActive =
      dates.length > 0
        ? new Date(Math.max(...dates.map((d) => new Date(d))))
        : null;

    // 4. Final Response — Clean & Professional
    res.json({
      ...user.toObject(),
      stats: {
        totalWorkouts: workoutCount,
        totalProgressLogs: progressCount,
        totalNutritionEntries: nutritionCount,
        lastActive: lastActive
          ? lastActive.toISOString().split("T")[0]
          : "Never",
        accountAgeDays: Math.floor(
          (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
        ),
      },
    });
  } catch (err) {
    console.error("getUserById Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res
        .status(400)
        .json({ message: "Cannot deactivate admin account" });
    }

    user.isActive = !user.isActive;
    await user.save();
    // SEND EMAIL
    const subject = user.isActive
      ? "Your account has been reactivated!"
      : "Your account has been deactivated";
    const html = user.isActive
      ? `<p>Great news! Your Fit X account has been <strong>reactivated</strong>. You can now log in and continue your fitness journey!</p>`
      : `<p>Your Fit X account has been <strong>deactivated</strong> by an administrator. Please contact support if you believe this is a mistake.</p>`;

    await adminEmailupdates(user.email, subject, html);

    res.json({
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      isActive: user.isActive,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

// 4. PERMANENTLY DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin account" });
    }
    await adminEmailupdates(
      user.email,
      "Your FitTrack account has been deleted",
      `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #ddd; margin-bottom: 12px;">
  Your account and all associated data have been permanently deleted by an administrator.
</p>
<p style="font-family: Arial, sans-serif; font-size: 16px; color: #ddd;">
  We're sorry to see you go. If this was a mistake, please contact support.
</p>`
    );
    await Promise.all([
      Workout.deleteMany({ user: user._id }),
      Nutrition.deleteMany({ user: user._id }),
      Progress.deleteMany({ user: user._id }),
      Notification.deleteMany({ user: user._id }),
    ]);

    await User.findByIdAndDelete(user._id);

    res.json({ message: "User and all data deleted permanently" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// 5. GET ALL WORKOUTS (Admin View)
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });

    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workouts" });
  }
};

// 6. ANALYTICS
export const getProgressAnalytics = async (req, res) => {
  try {
    const users = await User.find().select("latestProgress workoutCount");
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive).length;
    const totalWorkouts = users.reduce(
      (sum, u) => sum + (u.workoutCount || 0),
      0
    );

    res.json({
      totalUsers,
      activeUsers,
      totalWorkouts,
      avgWorkoutsPerUser: totalUsers
        ? (totalWorkouts / totalUsers).toFixed(1)
        : 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Analytics error" });
  }
};

// 7. SEND NOTIFICATION TO ALL
export const sendNotification = async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ message: "Title and message required" });
  }

  try {
    const users = await User.find({ isActive: true });
    const notifications = users.map((u) => ({
      user: u._id,
      title,
      message,
      type: "admin_broadcast",
    }));

    await Notification.insertMany(notifications);
    res.json({ message: `Notification sent to ${users.length} active users}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to send notification" });
  }
};

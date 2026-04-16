// backend/routes/notification.routes.js
import express from "express";
import Notification from "../models/Notification.js";
import verifyTokenMiddleware from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.get("/", verifyTokenMiddleware, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    user: req.user._id,
    isRead: false
  });

  res.json({ notifications, unreadCount });
});

router.patch("/:id/read", verifyTokenMiddleware, async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true }
  );
  res.json({ success: true });
});

export default router;
// backend/models/Notification.model.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["upcoming", "missed", "info"], default: "info" },
  workout: { type: mongoose.Schema.Types.ObjectId, ref: "Workout" },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", NotificationSchema);
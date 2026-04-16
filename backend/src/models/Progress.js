// backend/src/models/Progress.js
import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true, default: Date.now },
  weight: { type: Number }, // kg
  bodyFat: { type: Number }, // %
  waist: { type: Number }, // cm
  chest: { type: Number }, // cm
  arms: { type: Number }, // cm
  hips: { type: Number }, // cm
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model("Progress", ProgressSchema);
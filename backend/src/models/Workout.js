// models/Workout.model.js
import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, default: 0 },
});

const WorkoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["strength", "cardio", "flexibility", "other"],
    default: "other"
  },
  date: { type: Date, required: true },
  exercises: [ExerciseSchema],

  status: {
    type: String,
    enum: ["scheduled", "upcoming", "in-progress", "completed", "missed"],
    default: "scheduled"
  },

  startedAt: { type: Date },
  completedAt: { type: Date },
  missedAt: { type: Date },

}, { timestamps: true });

export default mongoose.model("Workout", WorkoutSchema);
// backend/controllers/workout.controller.js
import mongoose from "mongoose";
import Workout from "../models/Workout.js";
import { callGemini } from "../controllers/ai.controller.js";
import User from "../models/User.js";

// GET all workouts for user
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId }).sort({
      date: -1,
    });
    res.json({ workouts });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE new workout
// src/controllers/workout.controller.js
export const createWorkout = async (req, res) => {
  try {
    const { name, category, exercises, date } = req.body;

    // Validate workout name
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "Workout name is required" });
    }

    // Validate exercises
    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ message: "Add at least one exercise" });
    }

    // Validate each exercise
    for (const ex of exercises) {
      if (!ex.name || !ex.sets || !ex.reps) {
        return res
          .status(400)
          .json({ message: "Each exercise needs name, sets, and reps" });
      }
    }

    const workout = new Workout({
      user: req.userId, // from verifyToken middleware
      name: name.trim(),
      category: category || "other",
      date: date ? new Date(date) : new Date(),
      exercises,
      status: "scheduled",
    });

    await workout.save();
    res.status(201).json({ workout });
  } catch (err) {
    console.error("Workout save error:", err);
    res.status(500).json({
      message: "Failed to save workout",
      error: err.message,
    });
  }
};

export const startWorkout = async (req, res) => {
  const workout = await Workout.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!workout) return res.status(404).json({ message: "Not found" });

  if (workout.status !== "upcoming") {
    return res.status(400).json({ message: "Not ready to start" });
  }

  workout.status = "in-progress";
  workout.startedAt = new Date();
  await workout.save();

  res.json({ workout });
};

export const finishWorkout = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!workout) return res.status(404).json({ message: "Workout not found" });
    if (workout.status !== "in-progress") {
      return res.status(400).json({ message: "Workout not in progress" });
    }

    // Mark workout as completed
    workout.status = "completed";
    workout.completedAt = new Date();
    await workout.save();

    res.json({
      message: "Workout completed!",
      workout,
    });
  } catch (err) {
    console.error("Finish workout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/workout.controller.js
export const updateWorkout = async (req, res) => {
  const { id } = req.params;
  const { name, category, date, exercises, status } = req.body;

  console.log("🟡 Received update request for Workout ID:", id);
  console.log("📦 Request body:", { name, category, date, exercises, status });

  // 🔹 Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid workout ID" });
  }

  try {
    const updateData = {};

    // 🔹 Update name
    if (name) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Invalid workout name" });
      }
      updateData.name = name.trim();
    }

    // 🔹 Update category
    if (category) {
      const validCategories = ["strength", "cardio", "flexibility", "other"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          message: `Invalid category. Must be one of: ${validCategories.join(
            ", "
          )}`,
        });
      }
      updateData.category = category;
    }

    // 🔹 Update date
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      updateData.date = parsedDate;
    }

    // 🔹 Update status
    if (status) {
      const validStatuses = [
        "scheduled",
        "upcoming",
        "in-progress",
        "completed",
        "missed",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        });
      }

      updateData.status = status;

      // Automatically manage timestamps
      const now = new Date();
      if (status === "in-progress") updateData.startedAt = now;
      if (status === "completed") updateData.completedAt = now;
      if (status === "missed") updateData.missedAt = now;
    }

    // 🔹 Update exercises
    if (Array.isArray(exercises)) {
      updateData.exercises = exercises
        .map((ex) => ({
          name: ex.name?.trim(),
          sets: Number(ex.sets) || 0,
          reps: Number(ex.reps) || 0,
          weight: Number(ex.weight) || 0,
        }))
        .filter((ex) => ex.name);
    }

    // 🔹 Perform the update
    const workout = await Workout.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res
        .status(404)
        .json({ message: "Workout not found or not authorized" });
    }

    res.status(200).json({
      message: "Workout updated successfully",
      workout,
    });
  } catch (err) {
    console.error("❌ Update workout error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE workout
export const deleteWorkout = async (req, res) => {
  const { id } = req.params;
  try {
    const workout = await Workout.findOneAndDelete({
      _id: id,
      user: req.userId,
    });
    if (!workout) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

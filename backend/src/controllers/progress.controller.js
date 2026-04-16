// backend/src/controllers/progress.controller.js
import Progress from "../models/Progress.js";
import User from "../models/User.js";

// CREATE NEW PROGRESS LOG
export const logProgress = async (req, res) => {
  console.log("📥 Incoming /api/progress POST");
  console.log("👤 Auth user:", req.user);
  console.log("📦 Body:", req.body);

  try {
    // 🛑 Stop unauthorized or empty logs
    if (!req.user?._id) {
      console.warn("🚫 Missing user in request");
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🛑 Ensure there is at least one numeric value
    const hasData = [
      "weight",
      "bodyFat",
      "waist",
      "arms",
      "chest",
      "hips",
    ].some((f) => req.body[f] !== undefined && req.body[f] !== "");
    if (!hasData) {
      return res.status(400).json({ message: "No valid progress fields" });
    }

    const progress = new Progress({
      ...req.body,
      user: req.user._id,
    });

    await progress.save();
    console.log("✅ Progress saved:", progress);

    if (req.body.weight) {
      await User.findByIdAndUpdate(
        req.user._id,
        { weight: req.body.weight },
        { runValidators: true }
      );
    }


    res.status(201).json({
      progress,
    });
  } catch (err) {
    console.error("❌ Progress save failed:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL PROGRESS
export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(100);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET LATEST PROGRESS
export const getLatestProgress = async (req, res) => {
  try {
    const latest = await Progress.findOne({ user: req.user._id })
      .sort({ date: -1 })
      .lean();
    res.json(latest || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// backend/src/controllers/nutrition.controller.js
import Nutrition from "../models/Nutrition.js";


// CREATE
export const createNutrition = async (req, res) => {
  try {
    const nutrition = new Nutrition({ ...req.body, user: req.user._id });
    await nutrition.save();
    res.status(201).json(nutrition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL (date filter)
export const getNutritions = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { user: req.user._id };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const nutritions = await Nutrition.find(query).sort({ date: -1 });
    res.json(nutritions); // ← direct array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!nutrition) return res.status(404).json({ message: "Not found" });
    res.json(nutrition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
export const deleteNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!nutrition) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// backend/src/models/Nutrition.js
import mongoose from "mongoose";

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unit: { type: String, enum: ["g", "kg", "ml", "cup", "piece"], default: "g" },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
});

const NutritionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    required: true,
  },
  foods: [FoodItemSchema],
  date: { type: Date, required: true, default: Date.now },
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFats: { type: Number, default: 0 },
}, { timestamps: true });

// Pre-save: Calculate totals
NutritionSchema.pre("save", function (next) {
  this.totalCalories = this.foods.reduce((sum, f) => sum + f.calories, 0);
  this.totalProtein = this.foods.reduce((sum, f) => sum + f.protein, 0);
  this.totalCarbs = this.foods.reduce((sum, f) => sum + f.carbs, 0);
  this.totalFats = this.foods.reduce((sum, f) => sum + f.fats, 0);
  next();
});

export default mongoose.model("Nutrition", NutritionSchema);
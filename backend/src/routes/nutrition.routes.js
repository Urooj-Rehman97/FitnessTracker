// backend/src/routes/nutrition.routes.js
import express from "express";
import {
  createNutrition,
  getNutritions,
  updateNutrition,
  deleteNutrition,
} from "../controllers/nutrition.controller.js";
import auth from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.use(auth);

router.post("/", createNutrition);
router.get("/", getNutritions);
router.put("/:id", updateNutrition);
router.delete("/:id", deleteNutrition);

export default router;

// src/routes/ai.routes.js
import express from "express";
import verifyTokenMiddleware from "../middlewares/verifyToken.middleware.js";
import {
  queryNutrition,
  getProgressAdvice,
  getCalorieBurnAnalysis,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.use(verifyTokenMiddleware);

// AI Features
router.post("/nutrition/query", queryNutrition);
router.get("/advice", getProgressAdvice);
router.get("/calorie-burn", getCalorieBurnAnalysis);

export default router;

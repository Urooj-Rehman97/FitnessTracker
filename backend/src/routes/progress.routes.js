// backend/src/routes/progress.routes.js
import express from "express";
import {
  logProgress,
  getProgress,
  getLatestProgress,
} from "../controllers/progress.controller.js";
import auth from "../middlewares/verifyToken.middleware.js";

const router = express.Router();
router.use(auth);

router.post("/", logProgress);
router.get("/", getProgress);
router.get("/latest", getLatestProgress);
router.get("/:userId", getProgress);

export default router;
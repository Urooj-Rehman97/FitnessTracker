// src/routes/feedback.routes.js
import express from "express";
import { submitFeedback } from "../controllers/feedback.controller.js";
import verifyTokenMiddleware from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.use(verifyTokenMiddleware);

router.post("/", submitFeedback);

export default router;

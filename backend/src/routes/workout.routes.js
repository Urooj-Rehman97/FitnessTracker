// backend/routes/workout.routes.js
import express from "express";
import verifyTokenMiddleware from "../middlewares/verifyToken.middleware.js";
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  finishWorkout,
} from "../controllers/workout.controller.js";

const router = express.Router();

router.use(verifyTokenMiddleware);

router
  .get("/", getWorkouts)
  .post("/", createWorkout)
  .put("/:id", updateWorkout)
  .delete("/:id", deleteWorkout)
  // routes/workout.routes.js
  .post("/:id/finish", finishWorkout);

export default router;

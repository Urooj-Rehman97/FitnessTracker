// backend/jobs/workoutStatusJob.js
import cron from "node-cron";
import Workout from "../../models/Workout.js";
import { createNotification } from "../../utils/jobs/notification.service.js";

export const startWorkoutStatusJob = () => {
  cron.schedule("*/5 * * * *", async () => { 
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    try {
      const upcoming = await Workout.find({
        status: "scheduled",
        date: { $gte: now, $lte: oneHourLater },
      }).populate("user");

      for (const w of upcoming) {
        w.status = "upcoming";
        await w.save();

        await createNotification(w.user._id, {
          title: "Workout Soon!",
          message: `"${w.name}" in 1 hour!`,
          type: "upcoming",
          workoutId: w._id
        });
      }

      const missed = await Workout.find({
        status: "upcoming",
        date: { $lt: oneHourAgo },
      }).populate("user");

      for (const w of missed) {
        w.status = "missed";
        w.missedAt = new Date();
        await w.save();

        await createNotification(w.user._id, {
          title: "Missed Workout",
          message: `You missed "${w.name}"`,
          type: "missed",
          workoutId: w._id
        });
      }

      console.log("Workout status job ran at", new Date());
    } catch (err) {
      console.error("Cron error:", err);
    }
  });
};
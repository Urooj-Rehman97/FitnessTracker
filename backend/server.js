import app from "./src/app.js";
import connectDatabase from "./src/config/database.config.js";
import initializeSocket from "./src/config/socket.config.js";
import { PORT, NODE_ENV } from "./src/config/env.config.js";
import { startWorkoutStatusJob } from "./src/utils/jobs/workoutStatusJob.js";
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    console.log("✅ Database connected successfully");

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });

    // Initialize Socket.IO
    const io = initializeSocket(server);

    // Pass io to cron job
    startWorkoutStatusJob(io);
    console.log("✅ Socket.IO initialized");

    // Graceful shutdown || use 'SIGTERM' for production
    process.on("SIGINT", () => {
      console.log("⚠️  SIGINT received, shutting down gracefully");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

startServer();

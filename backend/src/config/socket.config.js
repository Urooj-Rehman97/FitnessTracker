import { Server } from "socket.io";
// backend/config/socket.config.js
let io;
global.userSockets = {};

const initializeSocket = (server) => {
  // const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join", (userId) => {
      global.userSockets[userId] = socket.id;
      console.log(`User ${userId} joined → ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const userId in global.userSockets) {
        if (global.userSockets[userId] === socket.id) {
          delete global.userSockets[userId];
          break;
        }
      }
    });
  });

  global.io = io;
  return io;
};

export default initializeSocket;
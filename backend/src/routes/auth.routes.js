import express from "express";
import {
  registerUser,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateProfile,
  deleteAccount,
} from "../controllers/auth.controller.js";
import verifyTokenMiddleware from "../middlewares/verifyToken.middleware.js";
import upload from "../config/cloudnary.config.js";

const router = express.Router();

// Authentication Routes
router
  .post("/register", registerUser)
  .get("/verify-email/:token", verifyEmail)
  .post("/login", login)
  .post("/logout", logout)
  .post("/forgot-password", forgotPassword)
  .post("/reset-password/:token", resetPassword)
  .get("/me", verifyTokenMiddleware, getCurrentUser)
  .put(
    "/profile",
    verifyTokenMiddleware,
    upload.single("profilePicture"),
    updateProfile
  )
  .post("/preferences", verifyTokenMiddleware, async (req, res) => {
    try {
      const { notifications, units, theme } = req.body;

      await req.user.updatePreferences({
        notifications,
        units,
        theme,
      });

      res.json({ success: true, preferences: req.user.preferences });
    } catch (error) {
      res.status(500).json({ error: "Failed to update preferences" });
    }
  })
  .delete("/delete-account", verifyTokenMiddleware, deleteAccount);

export default router;

// src/controllers/feedback.controller.js

import User from "../models/User.js";
import { sendUserFeedbackToAdmin } from "../utils/emailTemplates/feedbackEmail.js";

export const submitFeedback = async (req, res) => {
  try {
    const { type, message } = req.body;
    const userId = req.user.id;

    // Send beautiful themed email
    await sendUserFeedbackToAdmin(userId, type, message);

    res.json({ 
      message: "Feedback submitted successfully! Thank you" 
    });
  } catch (err) {
    console.error("Feedback submission error:", err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};
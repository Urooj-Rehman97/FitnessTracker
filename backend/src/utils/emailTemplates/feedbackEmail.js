import transporter from "../../config/nodemailer.config.js";
import User from "../../models/User.js";

export const sendUserFeedbackToAdmin = async (userId, feedbackType, message) => {
  try {
    const user = await User.findById(userId).select("username email profilePicture");

    const userName = user?.username || "Anonymous User";
    const userEmail = user?.email || "Not provided";
    const userAvatar =
      user?.profilePicture ||
      "https://res.cloudinary.com/dk6pkgyak/image/upload/v1761949436/default-avatar_e2tpup.jpg";

    // Badge color configuration based on feedback type
    const typeConfig = {
      bug: { label: "Bug Report", color: "#ef4444" },         // red
      feature: { label: "Feature Request", color: "#22c55e" }, // green
      improvement: { label: "UI/UX Improvement", color: "#e0be4f" }, // gold
      other: { label: "General Feedback", color: "#06b6d4" }  // cyan
    };

    const config = typeConfig[feedbackType] || typeConfig.other;

    await transporter.sendMail({
      from: '"FitTrack Feedback" <noreply@fittrack.com>',
      to: process.env.ADMIN_EMAIL || "admin@fittrack.com",
      subject: `Feedback • ${config.label} • ${userName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>New Feedback - FitTrack</title>
  <style>
    body {
      font-family: 'Inter', 'Segoe UI', sans-serif;
      background-color: #000000;
      color: #ffffff;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 620px;
      margin: 0 auto;
      background: #010b13;
      border-radius: 20px;
      border: 1px solid #334155;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(212, 175, 55, 0.25);
    }
    .header {
      background: linear-gradient(135deg, #d4af37, #e0be4f);
      text-align: center;
      padding: 40px 30px;
    }
    .header h1 {
      font-size: 32px;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
    }
    .content {
      padding: 32px;
    }
    .user-card {
      display: flex;
      align-items: center;
      background: #334155;
      padding: 20px;
      border-radius: 16px;
      border-left: 5px solid #d4af37;
      margin-bottom: 28px;
    }
    .avatar {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      border: 4px solid #d4af37;
      object-fit: cover;
      margin-right: 18px;
    }
    .username {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
    }
    .email {
      color: #94a3b8;
      font-size: 14px;
    }
    .feedback-box {
      background: #334155;
      padding: 24px;
      border-radius: 16px;
      border: 1px solid #334155;
    }
    .label {
      color: #d4af37;
      font-weight: 700;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 8px;
    }
    .badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 50px;
      font-size: 13px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 16px;
    }
    .message {
      font-size: 16px;
      line-height: 1.8;
      color: #dddddd;
      white-space: pre-line;
      margin: 16px 0;
    }
    .footer {
      text-align: center;
      padding: 28px;
      color: #94a3b8;
      font-size: 13px;
      border-top: 1px solid #334155;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Feedback</h1>
    </div>
    <div class="content">
      <div class="user-card">
        <img src="${userAvatar}" alt="${userName}" class="avatar" />
        <div>
          <div class="username">${userName}</div>
          <div class="email" style="color: #94a3b8; font-size: 14px;">${userEmail}</div>
        </div>
      </div>
      <div class="feedback-box">
        <div class="label">Feedback Type</div>
        <div class="badge" style="background: ${config.color};">${config.label}</div>
        <div class="label" style="margin-top: 24px;">Message</div>
        <p class="message">${message || "No message provided"}</p>
      </div>
      <p style="margin-top: 28px; color: #94a3b8; font-size: 14px;">
        This feedback was submitted from the FitTrack app.
      </p>
    </div>
    <div class="footer">
      © 2025 FitTrack • Built with Love & Passion
    </div>
  </div>
</body>
</html>
      `,
    });

    console.log(`Feedback email sent → ${config.label} from ${userName}`);
  } catch (err) {
    console.error("Failed to send feedback email:", err.message);
    throw err;
  }
};

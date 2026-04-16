import nodemailer from "nodemailer";
import {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
} from "./env.config.js";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Fitness Tracker" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📩 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email Error:", err.message);
  }
};

export default transporter;

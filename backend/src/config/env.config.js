import dotenv from "dotenv";

// ✅ Load env file conditionally
dotenv.config({
  path: process.env.NODE_ENV === "production"
    ? undefined   // Render / production → dashboard env vars
    : ".env.development" // local → file use hogi
});

// ✅ Basic vars
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 5000;

// ✅ Core secrets
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_EXPIRE = process.env.JWT_EXPIRE;
export const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE;
export const COOKIE_EXPIRE = process.env.COOKIE_EXPIRE;

// ✅ Cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// ✅ Email
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;

// ✅ Frontend URL
export const FRONTEND_URL = process.env.FRONTEND_URL;

// ==================
// 🔍 DEBUG LOGS (temporary — baad me remove kar dena)
// ==================
console.log("ENV CHECK:");
console.log("NODE_ENV:", NODE_ENV);
console.log("PORT:", PORT);
console.log("MONGO:", MONGODB_URI ? "✔ Loaded" : "❌ Missing");

// ==================
// ❗ SAFETY CHECKS
// ==================

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing!");
}

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("❌ JWT secrets are missing!");
}

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("❌ Cloudinary environment variables are missing!");
}

if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
  console.warn("⚠️ Warning: Email environment variables are incomplete!");
}
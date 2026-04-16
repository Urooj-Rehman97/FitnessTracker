import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_EXPIRE = process.env.JWT_EXPIRE;
export const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE;
export const COOKIE_EXPIRE = process.env.COOKIE_EXPIRE;

// Cloudinary config
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Email config
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
// export const EMAIL_FROM = process.env.EMAIL_FROM;

// Frontend URL
export const FRONTEND_URL = process.env.FRONTEND_URL;


// Safety checks for required variables
if (!MONGODB_URI) throw new Error('MONGODB_URI (MONGO_URI) is missing!');
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables are missing!');
}
if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    console.warn('Warning: Email environment variables are incomplete!');
}
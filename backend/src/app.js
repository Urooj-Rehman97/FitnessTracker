import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import Stripe from "stripe";   // ✅ Stripe added
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import nutritionRoutes from "./routes/nutrition.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import publicProductRoutes from "./routes/publicProducts.routes.js"; // ✅ new

import { NODE_ENV } from "./config/env.config.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ================= STRIPE =================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================= MIDDLEWARES =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());

// ================= LOGGING =================
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs/access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// ================= RATE LIMITER =================
const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again later.",
});
app.use(limiter);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", message: "Fitness Tracker API Running" });
});

// ================= STRIPE CHECKOUT =================
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((item) => ({
        price_data: {
          currency: "pkr",
          product_data: {
            name: item.name,
            images: [
              item.image?.startsWith("http")
                ? item.image
                : "https://via.placeholder.com/150",
            ],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);

// ======= ADMIN =======
app.use("/api/admin", adminRoutes); // Admin dashboard + products

// ======= PUBLIC =======
app.use("/api/products", publicProductRoutes); // Public fetch only

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;

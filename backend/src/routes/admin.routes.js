// routes/admin.routes.js
import express from "express";
import multer from "multer";

import verifyTokenMiddleware from "../middlewares/verifyToken.middleware.js";
import verifyAdminMiddleware from "../middlewares/adminVerify.middleware.js";

import {
  getUsers,
  getUserById,
  toggleUserStatus,
  deleteUser,
  getWorkouts,
  getProgressAnalytics,
  sendNotification,
} from "../controllers/admin.controller.js";

import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../controllers/product.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ================= GLOBAL ADMIN MIDDLEWARE ================= */
router.use(verifyTokenMiddleware);
router.use(verifyAdminMiddleware);

/* ================= USER MANAGEMENT ================= */
router.get("/users", getUsers);                      
router.get("/users/:id", getUserById);              
router.patch("/users/:id/toggle-status", toggleUserStatus); 
router.delete("/users/:id", deleteUser);            

/* ================= PRODUCTS (ADMIN) ================= */
router.get("/products", getProducts);               // List products
router.post("/products", upload.single("image"), addProduct); // Add product
router.put("/products/:id", upload.single("image"), updateProduct); // Update product
router.delete("/products/:id", deleteProduct);      // Delete product

/* ================= OTHER ADMIN ROUTES ================= */
router.get("/workouts", getWorkouts);                
router.get("/analytics", getProgressAnalytics);     
router.post("/send-notification", sendNotification);

export default router;

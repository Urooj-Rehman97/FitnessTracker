import express from "express";
import { getProducts } from "../controllers/product.controller.js";

const router = express.Router();

// GET all public products
router.get("/public", getProducts);

export default router;
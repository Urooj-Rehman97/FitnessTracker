import Product from "../models/Product.js";
import { uploadToCloudinary } from "../config/cloudnary.config.js";

// ==================== ADD PRODUCT (ADMIN) ====================
export const addProduct = async (req, res) => {
  try {
    const { name, description = "", price, category = "general" } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const productData = {
      name,
      description,
      price,
      category,
      createdBy: req.user._id,
    };

    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "fitness-tracker-assets/products"
        );
        productData.image = uploadResult.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const product = await Product.create(productData);
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== UPDATE PRODUCT (ADMIN) ====================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "fitness-tracker-assets/products"
        );
        updates.image = uploadResult.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== DELETE PRODUCT (ADMIN) ====================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== GET PRODUCTS ====================
export const getProducts = async (req, res) => {
  try {
    // Agar public page request hai to query me "public=true" bheja ja sakta hai
    const isPublic = req.originalUrl.includes("/public");

    const page = parseInt(req.query.page) || 1;
    const limit = isPublic ? parseInt(req.query.limit) || 100 : parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      products,
      pagination: isPublic
        ? undefined
        : {
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            limit,
          },
    });
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

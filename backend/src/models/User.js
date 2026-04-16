// src/models/User.schema.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    // ---- Basic Info ----
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    // ---- Profile Picture (flat URL) ----
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dk6pkgyak/image/upload/v1761949436/default-avatar_e2tpup.jpg",
    },

    // ---- Optional profile data ----
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number, min: [0, "Age must be positive"] },
    height: { type: Number, min: [0, "Height must be positive"] },
    weight: { type: Number, min: [0, "Weight must be positive"] },
    fitnessGoal: {
      type: String,
      enum: [
        "weight_loss",
        "muscle_gain",
        "maintenance",
        "endurance",
        "general_fitness",
      ],
      default: "general_fitness",
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
    },
    // ---- USER PREFERENCES (NEW!) ----
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        notifications: true,
        units: {
          type: String,
          enum: ["metric", "imperial"],
          default: "metric",
        },
        theme: {
          type: String,
          enum: ["light", "dark", "system"],
          default: "dark",
        },
      },
    },
    // ---- RBAC ----
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // ---- Account state ----
    isActive: { type: Boolean, default: true },

    // ---- Email verification ----
    emailVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,

    // ---- Password reset (separate fields) ----
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    lastLogin: { type: Date, default: null },
  },
  { timestamps: true } 
);

// -------------------------------------------------
// 1. Hash password
// -------------------------------------------------
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// -------------------------------------------------
// 2. Instance methods
// -------------------------------------------------
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAuthToken = function (expiresIn = "1d") {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

userSchema.methods.generateVerificationToken = function () {
  const token = jwt.sign({ email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  this.verificationToken = token;
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 h
  return token;
};

userSchema.methods.generatePasswordResetToken = function () {
  const plain = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(plain)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
  return plain;
};

// -------------------------------------------------
// 3. Helper: Update preferences
// -------------------------------------------------
userSchema.methods.updatePreferences = function (updates) {
  this.preferences = { ...this.preferences, ...updates };
  return this.save();
};

export default mongoose.model("User", userSchema);

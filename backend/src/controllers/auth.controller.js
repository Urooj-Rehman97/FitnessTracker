// src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Nutrition from "../models/Nutrition.js";
import Workout from "../models/Workout.js";
import Notification from "../models/Notification.js";
import Progress from "../models/Progress.js";
import { sendEmail } from "../config/nodemailer.config.js";
import { uploadToCloudinary } from "../config/cloudnary.config.js";
import { verificationEmailTemplate } from "../utils/emailTemplates/emailTemplates.js";

// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) throw new Error("JWT_SECRET missing");

// -------------------------------------------------
// REGISTER
// -------------------------------------------------
export const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      gender,
      age,
      height,
      weight,
      fitnessGoal,
      activityLevel,
    } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({
      username,
      email,
      password,
      gender,
      age,
      height,
      weight,
      fitnessGoal,
      activityLevel,
    });


    await user.save();


    const verifyToken = user.generateVerificationToken();
    console.log(verifyToken);

    await user.save(); 


    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
    const html = verificationEmailTemplate(username, verifyUrl);

    await sendEmail(email, "Verify Your Fitness Tracker Account", html);

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your inbox to verify your email.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------------------
// VERIFY EMAIL
// -------------------------------------------------
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) return res.status(400).json({ message: "Token missing" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (user.emailVerified) {
      return res.status(200).json({ message: "Email already verified!" });
    }

    // OPTIONAL: check expiry from DB
    if (user.verificationTokenExpires && user.verificationTokenExpires < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }

    // Verify
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    return res.json({ success: true, message: "Email verified successfully!" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


// -------------------------------------------------
// LOGIN
// -------------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.emailVerified)
      return res.status(401).json({ message: "Verify your email first" });

    if (!user.isActive)
      return res.status(403).json({ message: "Account deactivated" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    user.lastLogin = new Date();
    await user.save();

    const token = user.generateAuthToken(rememberMe ? "7d" : "1d");

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------------------
// LOGOUT
// -------------------------------------------------
export const logout = (_req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ success: true, message: "Logged out" });
};

//
// GET CURRENT USER (Session Check)
//
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error("❌ Get Current User Error:", error);
    res.status(500).json({ message: "Server error fetching user info" });
  }
};

// -------------------------------------------------
// FORGOT PASSWORD
// -------------------------------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const plainToken = user.generatePasswordResetToken();
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${plainToken}`;
    const html = `
      <h2>Password Reset</h2>
      <p>Click below to set a new password (expires in 15 min):</p>
      <a href="${resetUrl}" style="color:#4CAF50;">Reset Password</a>
    `;

    await sendEmail(email, "Password Reset – Fitness Tracker", html);
    res.json({ success: true, message: "Reset link sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------------------
// RESET PASSWORD
// -------------------------------------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password)
      return res
        .status(400)
        .json({ message: "Token and new password required" });

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });

    user.password = password; // pre-save hook will hash
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/auth.controller.js
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowed = [
      "username",
      "gender",
      "age",
      "height",
      "weight",
      "fitnessGoal",
      "activityLevel",
    ];

    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) filtered[key] = updates[key];
    }

    // If file was uploaded → add Cloudinary URL
    // ✅ Upload image to Cloudinary if file exists
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      filtered.profilePicture = uploadResult.secure_url;
    }

    const user = await User.findByIdAndUpdate(req.user.id, filtered, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ success: true, user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log(`Deleting account for user: ${userId}`);

    await Promise.all([
      Workout.deleteMany({ user: userId }),
      Nutrition?.deleteMany?.({ user: userId }) || Promise.resolve(),
      Progress?.deleteMany?.({ user: userId }) || Promise.resolve(),
      Notification?.deleteMany?.({ user: userId }) || Promise.resolve(),
    ]);

    // 2. Delete Cloudinary Profile Picture (Agar hai to)
    const user = await User.findById(userId);
    if (user?.profilePicture) {
      const publicId = user.profilePicture.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`fitness-tracker-assets/${publicId}`);
        console.log("Cloudinary image deleted");
      } catch (cloudErr) {
        console.log(
          "Cloudinary delete failed (not critical):",
          cloudErr.message
        );
      }
    }

    // 3. Finally delete the User
    await User.findByIdAndDelete(userId);

    // 4. Clear cookie & respond
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      success: true,
      message: "Account and all data permanently deleted!",
    });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
};

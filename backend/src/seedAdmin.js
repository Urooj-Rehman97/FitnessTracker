// scripts/seedAdmin.js
import dotenv from "dotenv";
import connectDatabase from "./config/database.config.js";
import User from "./models/User.js";

dotenv.config({ path: ".env.development" });

const seedAdmin = async () => {
  try {
    await connectDatabase();

    const {
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_USERNAME,
    } = process.env;


    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("Admin already exists →", ADMIN_EMAIL);
      process.exit(0);
    }

    const admin = new User({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,             
      role: "admin",
      emailVerified: true,
      isActive: true,
      profilePicture:
        "https://res.cloudinary.com/dk6pkgyak/image/upload/v1761949436/default-avatar_e2tpup.jpg",
    });

    await admin.save();

    console.log("Admin seeded successfully");
    console.table({
      Email: admin.email,
      Username: admin.username,
      Role: admin.role,
      Verified: admin.emailVerified,
    });

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
};

seedAdmin();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const { connectDB, User } = require("./db");

dotenv.config();

const createAdmin = async () => {
  try {
    if (!process.env.ADMIN_NAME) {
      throw new Error("ADMIN_NAME is missing from .env");
    }

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is missing from .env");
    }

    if (!process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_PASSWORD is missing from .env");
    }

    if (process.env.ADMIN_PASSWORD.length < 8) {
      throw new Error(
        "ADMIN_PASSWORD must be at least 8 characters."
      );
    }

    await connectDB();

    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log("⚠️ An admin with this email already exists.");
      } else {
        console.log(
          "⚠️ This email already belongs to a normal user."
        );
        console.log(
          "❌ No changes were made."
        );
      }

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      12
    );

    const admin = await User.create({
      name: process.env.ADMIN_NAME.trim(),
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("=================================");
    console.log("✅ ADMIN ACCOUNT CREATED");
    console.log("=================================");
    console.log(`👤 Name: ${admin.name}`);
    console.log(`📧 Email: ${admin.email}`);
    console.log("🔐 Password: Stored securely");
    console.log("🛡️ Role: admin");
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Admin creation failed:");
    console.error(error.message);

    process.exit(1);
  }
};

createAdmin();
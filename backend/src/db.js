require("dotenv").config();
const mongoose = require("mongoose");

// ========================================
// USER SCHEMA
// ========================================

const userSchema = new mongoose.Schema(
  {
    // ACCOUNT INFORMATION
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
    },

    // MELAHUB PROFILE
    profile: {
      education: {
        type: String,
        default: "",
        trim: true,
      },

      field: {
        type: String,
        default: "",
        trim: true,
      },

      location: {
        type: String,
        default: "",
        trim: true,
      },

      skills: {
        type: [String],
        default: [],
      },

      interests: {
        type: [String],
        default: [],
      },

      experience: {
        type: String,
        default: "Student",
      },

      availability: {
        type: String,
        default: "Full Time",
      },
    },
  },
  {
    timestamps: true,
  }
);

// ========================================
// USER MODEL
// ========================================

const User = mongoose.model("User", userSchema);

// ========================================
// MONGODB CONNECTION
// ========================================

const connectDB = async () => {
  try {
    // Check whether .env contains the MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from the .env file."
      );
    }

    // SECURITY: Never print the password
    console.log("🔍 MongoDB URI loaded: YES");
    console.log(
      "🔍 URI starts with:",
      process.env.MONGODB_URI.substring(0, 20) + "..."
    );

    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("=================================");
    console.log("🍃 MongoDB Connected Successfully");
    console.log("=================================");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);

    process.exit(1);
  }
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
  connectDB,
  User,
};
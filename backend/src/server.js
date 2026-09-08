const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectDB } = require("./db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const matchRoutes = require("./routes/matchRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MelaHub backend is running 🚀",
  });
});

// ========================================
// DATABASE TEST
// ========================================

app.get("/db-test", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    const connected =
      mongoose.connection.readyState === 1;

    if (!connected) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not connected.",
      });
    }

    res.json({
      success: true,
      message: "MongoDB connected successfully 🎉",
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});

// ========================================
// API ROUTES
// ========================================

// Authentication
app.use("/api/auth", authRoutes);

// User Profile
app.use("/api/profile", profileRoutes);

// Smart Matching
app.use("/api/matches", matchRoutes);

// Opportunities
app.use("/api/opportunities", opportunityRoutes);

// Applications
app.use("/api/applications", applicationRoutes);

// ========================================
// START SERVER
// ========================================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("=================================");
      console.log("🚀 MelaHub Backend Started");
      console.log(`🌐 http://localhost:${PORT}`);
      console.log("🍃 MongoDB: Connected");
      console.log("🧠 Smart Matching: Ready");
      console.log("💼 Opportunities API: Ready");
      console.log("📝 Applications API: Ready");
      console.log("=================================");
    });
  } catch (error) {
    console.error(
      "❌ Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};

if (process.env.VERCEL) {
  module.exports = app;
} else {
  startServer();
}
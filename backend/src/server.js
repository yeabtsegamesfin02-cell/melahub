const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./db").connectDB;

// =====================================
// ROUTES
// =====================================

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const matchRoutes = require("./routes/matchRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/admin");
const businessRoutes = require("./routes/businessRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const savedOpportunityRoutes = require("./routes/savedOpportunityRoutes");

// =====================================
// APP
// =====================================

const app = express();

// =====================================
// CORS
// =====================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

// =====================================
// BODY PARSER
// =====================================

app.use(express.json());

// =====================================
// ROOT ROUTE
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MelaHub Backend API is running 🚀",
  });
});

// =====================================
// API ROUTES
// =====================================

// Authentication
app.use("/api/auth", authRoutes);

// User profile
app.use("/api/profile", profileRoutes);

// Smart matching
app.use("/api/matches", matchRoutes);

// Opportunities
app.use("/api/opportunities", opportunityRoutes);

// Applications
app.use("/api/applications", applicationRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// Businesses
app.use("/api/businesses", businessRoutes);

// Settings
app.use("/api/settings", settingsRoutes);

// Saved opportunities
app.use(
  "/api/saved-opportunities",
  savedOpportunityRoutes
);

// =====================================
// 404 HANDLER
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// =====================================
// GLOBAL ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// =====================================
// START SERVER
// =====================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("");
      console.log("=====================================");
      console.log("🚀 MelaHub Backend Started");
      console.log("=====================================");
      console.log(`🌐 http://localhost:${PORT}`);
      console.log("🍃 MongoDB: Connected");
      console.log("🔐 Authentication API: Ready");
      console.log("👤 Profile API: Ready");
      console.log("🧠 Smart Matching: Ready");
      console.log("💼 Opportunities API: Ready");
      console.log("📝 Applications API: Ready");
      console.log("🛡️ Admin API: Ready");
      console.log("🏢 Businesses API: Ready");
      console.log("⚙️ Settings API: Ready");
      console.log("⭐ Saved Opportunities API: Ready");
      console.log("=====================================");
      console.log("");
    });
  } catch (error) {
    console.error("");
    console.error("❌ Failed to start MelaHub backend.");
    console.error(error);
    console.error("");

    process.exit(1);
  }
};

startServer();
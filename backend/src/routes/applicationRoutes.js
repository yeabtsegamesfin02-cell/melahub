const express = require("express");
const jwt = require("jsonwebtoken");

const { User } = require("../db");
const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");

const router = express.Router();

// ========================================
// AUTHENTICATION
// ========================================

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// ========================================
// CREATE APPLICATION
// POST /api/applications
// ========================================

router.post("/", protect, async (req, res) => {
  try {
    const {
      opportunityId,
      name,
      email,
      message,
    } = req.body;

    // Check required fields
    if (
      !opportunityId ||
      !name ||
      !email ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Opportunity, name, email and message are required.",
      });
    }

    // Check opportunity
    const opportunity =
      await Opportunity.findOne({
        _id: opportunityId,
        isActive: true,
      });

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found.",
      });
    }

    // Prevent duplicate applications
    const existingApplication =
      await Application.findOne({
        user: req.user._id,
        opportunity: opportunityId,
      });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message:
          "You have already applied for this opportunity.",
      });
    }

    // Create application
    const application =
      await Application.create({
        user: req.user._id,
        opportunity: opportunityId,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

    res.status(201).json({
      success: true,
      message:
        "Application submitted successfully! 🚀",
      application,
    });
  } catch (error) {
    console.error(
      "Application creation error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to submit application.",
    });
  }
});

// ========================================
// GET MY APPLICATIONS
// GET /api/applications
// ========================================

router.get("/", protect, async (req, res) => {
  try {
    const applications =
      await Application.find({
        user: req.user._id,
      })
        .populate(
          "opportunity",
          "title category organization location deadline"
        )
        .sort({ createdAt: -1 })
        .lean();

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Failed to load applications:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load applications.",
    });
  }
});

// ========================================
// GET ONE APPLICATION
// GET /api/applications/:id
// ========================================

router.get("/:id", protect, async (req, res) => {
  try {
    const application =
      await Application.findOne({
        _id: req.params.id,
        user: req.user._id,
      })
        .populate(
          "opportunity",
          "title category organization location deadline description"
        )
        .lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(
      "Failed to load application:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load application.",
    });
  }
});

module.exports = router;
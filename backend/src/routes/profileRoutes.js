const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../db");

const router = express.Router();

// =====================================
// AUTHENTICATION MIDDLEWARE
// =====================================

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
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

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// =====================================
// GET MY PROFILE
// GET /api/profile
// =====================================

router.get("/", protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get profile.",
    });
  }
});

// =====================================
// UPDATE MY PROFILE
// PUT /api/profile
// =====================================

router.put("/", protect, async (req, res) => {
  try {
    const {
      education,
      field,
      location,
      skills,
      interests,
      experience,
      availability,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.profile.education = education || "";
    user.profile.field = field || "";
    user.profile.location = location || "";

    user.profile.skills = Array.isArray(skills)
      ? skills
      : [];

    user.profile.interests = Array.isArray(interests)
      ? interests
      : [];

    user.profile.experience =
      experience || "Student";

    user.profile.availability =
      availability || "Full Time";

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
});

module.exports = router;
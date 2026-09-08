const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const Opportunity = require("../models/Opportunity");
const {
  calculateMatchingScore,
} = require("../utils/matchingEngine");

const router = express.Router();

// =====================================
// AUTHENTICATION
// =====================================

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

// =====================================
// SMART MATCHES
// =====================================

router.get("/", protect, async (req, res) => {
  try {
    const profile = req.user.profile || {};

    // Get active opportunities from MongoDB
    const opportunities =
      await Opportunity.find({
        isActive: true,
      }).lean();

    // Calculate match score for every opportunity
    const matches = opportunities
      .map((opportunity) => {
        const result =
          calculateMatchingScore(
            profile,
            opportunity
          );

        return {
          ...opportunity,

          match: result.score,

          breakdown: result.breakdown,

          matchedSkills:
            result.matchedSkills,

          matchedInterests:
            result.matchedInterests,
        };
      })
      .sort(
        (a, b) => b.match - a.match
      );

    res.json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error(
      "Matching error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to generate smart matches.",
    });
  }
});

module.exports = router;
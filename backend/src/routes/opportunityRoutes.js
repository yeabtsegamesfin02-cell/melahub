const express = require("express");
const mongoose = require("mongoose");

const Opportunity = require("../models/Opportunity");

const router = express.Router();

// ========================================
// GET ALL ACTIVE OPPORTUNITIES
// ========================================

router.get("/", async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: opportunities.length,
      opportunities,
    });
  } catch (error) {
    console.error(
      "❌ Failed to load opportunities:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to load opportunities.",
    });
  }
});

// ========================================
// GET ONE OPPORTUNITY
// ========================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID.",
      });
    }

    const opportunity =
      await Opportunity.findOne({
        _id: id,
        isActive: true,
      }).lean();

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found.",
      });
    }

    res.json({
      success: true,
      opportunity,
    });
  } catch (error) {
    console.error(
      "❌ Failed to load opportunity:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to load opportunity.",
    });
  }
});

module.exports = router;
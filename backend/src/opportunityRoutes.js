const express = require("express");
const mongoose = require("mongoose");
const Opportunity = require("../models/Opportunity");

const router = express.Router();

// GET all active opportunities
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
    console.error("Failed to load opportunities:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load opportunities.",
    });
  }
});

// GET one opportunity by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID.",
      });
    }

    const opportunity = await Opportunity.findOne({
      _id: req.params.id,
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
    console.error("Failed to load opportunity:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load opportunity.",
    });
  }
});

module.exports = router;
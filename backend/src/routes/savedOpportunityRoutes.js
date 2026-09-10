const express = require("express");
const SavedOpportunity = require("../models/SavedOpportunity");
const Opportunity = require("../models/Opportunity");
const { protect } = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================
// GET SAVED OPPORTUNITIES
// GET /api/saved-opportunities
// =====================================

router.get("/", protect, async (req, res) => {
  try {
    const saved = await SavedOpportunity.find({
      user: req.user._id,
    })
      .populate("opportunity")
      .sort({ createdAt: -1 });

    const opportunities = saved
      .filter((item) => item.opportunity)
      .map((item) => item.opportunity);

    res.json({
      success: true,
      opportunities,
    });
  } catch (error) {
    console.error("Get saved opportunities error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load saved opportunities.",
    });
  }
});

// =====================================
// SAVE OPPORTUNITY
// POST /api/saved-opportunities/:opportunityId
// =====================================

router.post(
  "/:opportunityId",
  protect,
  async (req, res) => {
    try {
      const { opportunityId } = req.params;

      const opportunity = await Opportunity.findOne({
        _id: opportunityId,
        isActive: true,
      });

      if (!opportunity) {
        return res.status(404).json({
          success: false,
          message: "Opportunity not found.",
        });
      }

      const existing = await SavedOpportunity.findOne({
        user: req.user._id,
        opportunity: opportunityId,
      });

      if (existing) {
        return res.status(200).json({
          success: true,
          message: "Opportunity is already saved.",
          saved: true,
        });
      }

      await SavedOpportunity.create({
        user: req.user._id,
        opportunity: opportunityId,
      });

      res.status(201).json({
        success: true,
        message: "Opportunity saved successfully.",
        saved: true,
      });
    } catch (error) {
      console.error("Save opportunity error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to save opportunity.",
      });
    }
  }
);

// =====================================
// UNSAVE OPPORTUNITY
// DELETE /api/saved-opportunities/:opportunityId
// =====================================

router.delete(
  "/:opportunityId",
  protect,
  async (req, res) => {
    try {
      const { opportunityId } = req.params;

      await SavedOpportunity.findOneAndDelete({
        user: req.user._id,
        opportunity: opportunityId,
      });

      res.json({
        success: true,
        message: "Opportunity removed from saved opportunities.",
        saved: false,
      });
    } catch (error) {
      console.error("Unsave opportunity error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to remove saved opportunity.",
      });
    }
  }
);

// =====================================
// CHECK IF OPPORTUNITY IS SAVED
// GET /api/saved-opportunities/:opportunityId/check
// =====================================

router.get(
  "/:opportunityId/check",
  protect,
  async (req, res) => {
    try {
      const saved = await SavedOpportunity.exists({
        user: req.user._id,
        opportunity: req.params.opportunityId,
      });

      res.json({
        success: true,
        saved: !!saved,
      });
    } catch (error) {
      console.error("Check saved opportunity error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to check saved opportunity.",
      });
    }
  }
);

module.exports = router;
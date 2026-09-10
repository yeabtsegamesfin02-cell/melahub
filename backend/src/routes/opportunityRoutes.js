const express = require("express");
const mongoose = require("mongoose");
const Opportunity = require("../models/Opportunity");
const {
  protect,
  adminOnly,
} = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================
// PUBLIC — GET ACTIVE OPPORTUNITIES
// GET /api/opportunities
// =====================================

router.get("/", async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: opportunities.length,
      opportunities,
    });
  } catch (error) {
    console.error("Failed to load opportunities:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load opportunities.",
    });
  }
});

// =====================================
// PUBLIC — GET ONE ACTIVE OPPORTUNITY
// GET /api/opportunities/:id
// =====================================

router.get("/:id", async (req, res, next) => {
  try {
    if (req.params.id === "admin") {
      return next();
    }

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

    return res.json({
      success: true,
      opportunity,
    });
  } catch (error) {
    console.error("Failed to load opportunity:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load opportunity.",
    });
  }
});

// =====================================
// ADMIN — GET ALL OPPORTUNITIES
// GET /api/opportunities/admin/all
// =====================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const opportunities = await Opportunity.find()
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        success: true,
        count: opportunities.length,
        opportunities,
      });
    } catch (error) {
      console.error(
        "Failed to load admin opportunities:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to load opportunities.",
      });
    }
  }
);

// =====================================
// ADMIN — CREATE OPPORTUNITY
// POST /api/opportunities/admin
// =====================================

router.post(
  "/admin",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        location,
        skills,
        interests,
        organization,
        deadline,
        applicationUrl,
        isActive,
      } = req.body;

      if (
        !title ||
        !category ||
        !location
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title, category and location are required.",
        });
      }

      const opportunity = await Opportunity.create({
        title: title.trim(),
        description:
          typeof description === "string"
            ? description.trim()
            : "",
        category: category.trim(),
        location: location.trim(),
        skills: Array.isArray(skills)
          ? skills
              .map((skill) =>
                String(skill).trim()
              )
              .filter(Boolean)
          : [],
        interests: Array.isArray(interests)
          ? interests
              .map((interest) =>
                String(interest).trim()
              )
              .filter(Boolean)
          : [],
        organization:
          typeof organization === "string"
            ? organization.trim()
            : "",
        deadline: deadline
          ? new Date(deadline)
          : null,
        applicationUrl:
          typeof applicationUrl === "string"
            ? applicationUrl.trim()
            : "",
        isActive:
          typeof isActive === "boolean"
            ? isActive
            : true,
      });

      return res.status(201).json({
        success: true,
        message:
          "Opportunity created successfully.",
        opportunity,
      });
    } catch (error) {
      console.error(
        "Create opportunity error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Could not create opportunity.",
      });
    }
  }
);

// =====================================
// ADMIN — UPDATE OPPORTUNITY
// PUT /api/opportunities/admin/:id
// =====================================

router.put(
  "/admin/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      if (
        !mongoose.isValidObjectId(req.params.id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid opportunity ID.",
        });
      }

      const {
        title,
        description,
        category,
        location,
        skills,
        interests,
        organization,
        deadline,
        applicationUrl,
        isActive,
      } = req.body;

      if (
        !title ||
        !category ||
        !location
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title, category and location are required.",
        });
      }

      const opportunity =
        await Opportunity.findByIdAndUpdate(
          req.params.id,
          {
            title: title.trim(),
            description:
              typeof description === "string"
                ? description.trim()
                : "",
            category: category.trim(),
            location: location.trim(),
            skills: Array.isArray(skills)
              ? skills
                  .map((skill) =>
                    String(skill).trim()
                  )
                  .filter(Boolean)
              : [],
            interests: Array.isArray(
              interests
            )
              ? interests
                  .map((interest) =>
                    String(interest).trim()
                  )
                  .filter(Boolean)
              : [],
            organization:
              typeof organization === "string"
                ? organization.trim()
                : "",
            deadline: deadline
              ? new Date(deadline)
              : null,
            applicationUrl:
              typeof applicationUrl === "string"
                ? applicationUrl.trim()
                : "",
            isActive:
              typeof isActive === "boolean"
                ? isActive
                : true,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!opportunity) {
        return res.status(404).json({
          success: false,
          message: "Opportunity not found.",
        });
      }

      return res.json({
        success: true,
        message:
          "Opportunity updated successfully.",
        opportunity,
      });
    } catch (error) {
      console.error(
        "Update opportunity error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Could not update opportunity.",
      });
    }
  }
);

// =====================================
// ADMIN — TOGGLE ACTIVE STATUS
// PATCH /api/opportunities/admin/:id/status
// =====================================

router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      if (
        !mongoose.isValidObjectId(req.params.id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid opportunity ID.",
        });
      }

      const opportunity =
        await Opportunity.findById(
          req.params.id
        );

      if (!opportunity) {
        return res.status(404).json({
          success: false,
          message: "Opportunity not found.",
        });
      }

      opportunity.isActive =
        !opportunity.isActive;

      await opportunity.save();

      return res.json({
        success: true,
        message: opportunity.isActive
          ? "Opportunity published."
          : "Opportunity unpublished.",
        opportunity,
      });
    } catch (error) {
      console.error(
        "Toggle opportunity status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Could not change opportunity status.",
      });
    }
  }
);

// =====================================
// ADMIN — DELETE OPPORTUNITY
// DELETE /api/opportunities/admin/:id
// =====================================

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      if (
        !mongoose.isValidObjectId(req.params.id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid opportunity ID.",
        });
      }

      const opportunity =
        await Opportunity.findById(
          req.params.id
        );

      if (!opportunity) {
        return res.status(404).json({
          success: false,
          message: "Opportunity not found.",
        });
      }

      await Opportunity.findByIdAndDelete(
        req.params.id
      );

      return res.json({
        success: true,
        message:
          "Opportunity deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete opportunity error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Could not delete opportunity.",
      });
    }
  }
);

module.exports = router;

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

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

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

// ========================================
// ADMIN ONLY
// ========================================

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
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

    if (!opportunityId || !name || !email || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Opportunity, name, email and message are required.",
      });
    }

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

    const existingApplication = await Application.findOne({
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

    const application = await Application.create({
      user: req.user._id,
      opportunity: opportunityId,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully! 🚀",
      application,
    });
  } catch (error) {
    console.error("Application creation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to submit application.",
    });
  }
});

// ========================================
// GET MY APPLICATIONS
// GET /api/applications
// ========================================

router.get("/", protect, async (req, res) => {
  try {
    const applications = await Application.find({
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
    console.error("Failed to load applications:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to load applications.",
    });
  }
});

// ========================================
// ADMIN: GET ALL APPLICATIONS
// GET /api/applications/admin/all
// ========================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const applications = await Application.find()
        .populate(
          "user",
          "name email role"
        )
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
        "Failed to load all applications:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Failed to load applications.",
      });
    }
  }
);

// ========================================
// ADMIN: UPDATE APPLICATION STATUS
// PATCH /api/applications/admin/:id/status
// ========================================

router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Submitted",
        "Under Review",
        "Accepted",
        "Rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application status.",
        });
      }

      const application = await Application.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("user", "name email role")
        .populate(
          "opportunity",
          "title category organization location deadline"
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found.",
        });
      }

      res.json({
        success: true,
        message: "Application status updated successfully.",
        application,
      });
    } catch (error) {
      console.error(
        "Application status update error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Failed to update application status.",
      });
    }
  }
);

// ========================================
// ADMIN: DELETE APPLICATION
// DELETE /api/applications/admin/:id
// ========================================

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const application = await Application.findByIdAndDelete(
        req.params.id
      );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found.",
        });
      }

      res.json({
        success: true,
        message: "Application deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Application deletion error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Failed to delete application.",
      });
    }
  }
);

// ========================================
// GET ONE APPLICATION
// GET /api/applications/:id
// ========================================

router.get("/:id", protect, async (req, res) => {
  try {
    const application = await Application.findOne({
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
      message: "Failed to load application.",
    });
  }
});

module.exports = router;
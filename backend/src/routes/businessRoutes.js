const express = require("express");
const jwt = require("jsonwebtoken");

const { User } = require("../db");
const Business = require("../models/Business");

const router = express.Router();

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
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

// GET ACTIVE BUSINESSES
router.get("/", async (req, res) => {
  try {
    const businesses = await Business.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: businesses.length,
      businesses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load businesses.",
    });
  }
});

// ADMIN GET ALL
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: businesses.length,
      businesses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load businesses.",
    });
  }
});

// ADMIN CREATE
router.post("/admin", protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      location,
      phone,
      email,
      website,
      image,
      isActive,
    } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "Name, category and location are required.",
      });
    }

    const business = await Business.create({
      name: name.trim(),
      description: description?.trim() || "",
      category: category.trim(),
      location: location.trim(),
      phone: phone?.trim() || "",
      email: email?.trim() || "",
      website: website?.trim() || "",
      image: image?.trim() || "",
      owner: req.user._id,
      isActive: isActive !== false,
    });

    res.status(201).json({
      success: true,
      message: "Business created successfully.",
      business,
    });
  } catch (error) {
    console.error("Business creation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create business.",
    });
  }
});

// ADMIN UPDATE
router.put("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      location,
      phone,
      email,
      website,
      image,
      isActive,
    } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "Name, category and location are required.",
      });
    }

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        description: description?.trim() || "",
        category: category.trim(),
        location: location.trim(),
        phone: phone?.trim() || "",
        email: email?.trim() || "",
        website: website?.trim() || "",
        image: image?.trim() || "",
        isActive: isActive !== false,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found.",
      });
    }

    res.json({
      success: true,
      message: "Business updated successfully.",
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update business.",
    });
  }
});

// ADMIN STATUS
router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const business = await Business.findByIdAndUpdate(
        req.params.id,
        { isActive: req.body.isActive },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!business) {
        return res.status(404).json({
          success: false,
          message: "Business not found.",
        });
      }

      res.json({
        success: true,
        message: "Business status updated.",
        business,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update business status.",
      });
    }
  }
);

// ADMIN DELETE
router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const business = await Business.findByIdAndDelete(
        req.params.id
      );

      if (!business) {
        return res.status(404).json({
          success: false,
          message: "Business not found.",
        });
      }

      res.json({
        success: true,
        message: "Business deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete business.",
      });
    }
  }
);

module.exports = router;
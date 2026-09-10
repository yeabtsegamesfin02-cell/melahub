const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../db");
const { protect, adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// =====================================

router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    const totalAccounts = await User.countDocuments();

    return res.json({
      success: true,
      message: "Welcome to MelaHub Admin Dashboard.",
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      statistics: {
        totalUsers,
        totalAdmins,
        totalAccounts,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load admin dashboard.",
    });
  }
});

// =====================================
// GET ALL USERS
// GET /api/admin/users
// =====================================

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load users.",
    });
  }
});

// =====================================
// CREATE ADMIN
// POST /api/admin/create-admin
// =====================================

router.post(
  "/create-admin",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required.",
        });
      }

      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Admin password must be at least 8 characters.",
        });
      }

      const existingUser = await User.findOne({
        email: cleanEmail,
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const admin = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: "admin",
      });

      return res.status(201).json({
        success: true,
        message: "Admin account created successfully.",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("Create admin error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not create admin account.",
      });
    }
  }
);

// =====================================
// DELETE USER
// DELETE /api/admin/users/:id
// =====================================

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // Prevent an admin from deleting their own account.
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own admin account.",
        });
      }

      await User.findByIdAndDelete(req.params.id);

      return res.json({
        success: true,
        message: "User deleted successfully.",
      });
    } catch (error) {
      console.error("Delete user error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not delete user.",
      });
    }
  }
);

module.exports = router;
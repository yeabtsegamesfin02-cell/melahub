const express = require("express");
const Settings = require("../models/Settings");
const {
  protect,
  adminOnly,
} = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================
// GET SETTINGS
// GET /api/settings
// =====================================

router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load settings.",
    });
  }
});

// =====================================
// UPDATE SETTINGS
// PUT /api/settings
// ADMIN ONLY
// =====================================

router.put(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const {
        siteName,
        supportEmail,
        maintenanceMode,
        emailNotifications,
        newApplicationNotifications,
        newBusinessNotifications,
      } = req.body;

      let settings = await Settings.findOne();

      if (!settings) {
        settings = new Settings();
      }

      if (siteName !== undefined) {
        settings.siteName = String(siteName).trim();
      }

      if (supportEmail !== undefined) {
        settings.supportEmail = String(
          supportEmail
        )
          .trim()
          .toLowerCase();
      }

      if (maintenanceMode !== undefined) {
        settings.maintenanceMode =
          Boolean(maintenanceMode);
      }

      if (emailNotifications !== undefined) {
        settings.emailNotifications =
          Boolean(emailNotifications);
      }

      if (
        newApplicationNotifications !==
        undefined
      ) {
        settings.newApplicationNotifications =
          Boolean(newApplicationNotifications);
      }

      if (newBusinessNotifications !== undefined) {
        settings.newBusinessNotifications =
          Boolean(newBusinessNotifications);
      }

      await settings.save();

      res.json({
        success: true,
        message: "Settings updated successfully.",
        settings,
      });
    } catch (error) {
      console.error("Update settings error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update settings.",
      });
    }
  }
);

module.exports = router;
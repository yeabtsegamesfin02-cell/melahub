const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "MelaHub",
      trim: true,
    },

    supportEmail: {
      type: String,
      default: "support@melahub.com",
      trim: true,
      lowercase: true,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    newApplicationNotifications: {
      type: Boolean,
      default: true,
    },

    newBusinessNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);
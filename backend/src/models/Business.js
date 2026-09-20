const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ========================================
    // MONETIZATION FIELDS
    // ========================================

    subscriptionPlan: {
      type: String,
      enum: ["Free", "Basic", "Premium"],
      default: "Free",
    },

    subscriptionStatus: {
      type: String,
      enum: ["active", "pending", "expired", "none"],
      default: "none",
    },

    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },

    // Premium subscribers are shown first / with a badge
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Business", businessSchema);
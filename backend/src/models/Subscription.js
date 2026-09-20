const mongoose = require("mongoose");

// ========================================
// PLAN DEFINITIONS (single source of truth)
// Prices are in ETB (Ethiopian Birr) per month.
// ========================================

const PLANS = {
  Free: {
    price: 0,
    listingLimit: 1,
    featured: false,
    label: "Free",
  },
  Basic: {
    price: 499,
    listingLimit: 5,
    featured: false,
    label: "Basic",
  },
  Premium: {
    price: 1499,
    listingLimit: Infinity,
    featured: true,
    label: "Premium",
  },
};

const subscriptionSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: String,
      enum: ["Free", "Basic", "Premium"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    billingCycle: {
      type: String,
      enum: ["monthly"],
      default: "monthly",
    },

    paymentMethod: {
      type: String,
      enum: ["telebirr", "chapa", "bank_transfer", "none"],
      default: "none",
    },

    // Reference number / transaction ID the payer provides
    // (Telebirr SMS code, bank transfer reference, etc.)
    transactionReference: {
      type: String,
      default: "",
      trim: true,
    },

    // Optional link to an uploaded receipt/screenshot
    receiptUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // Chapa-specific fields (populated when paymentMethod === "chapa")
    chapaTxRef: {
      type: String,
      default: "",
    },

    chapaCheckoutUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "active", "rejected", "expired"],
      default: "pending",
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = { Subscription, PLANS };

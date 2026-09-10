const mongoose = require("mongoose");

const savedOpportunitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user cannot save the same opportunity twice.
savedOpportunitySchema.index(
  { user: 1, opportunity: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "SavedOpportunity",
  savedOpportunitySchema
);
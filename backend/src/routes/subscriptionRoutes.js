const express = require("express");
const crypto = require("crypto");

const Business = require("../models/Business");
const { Subscription, PLANS } = require("../models/Subscription");
const { protect, adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000;

// =====================================
// HELPER: auto-expire subscriptions whose
// time has passed. Runs lazily on read.
// =====================================

const expireOverdueSubscriptions = async () => {
  const now = new Date();

  const overdue = await Business.find({
    subscriptionStatus: "active",
    subscriptionPlan: { $ne: "Free" },
    subscriptionExpiresAt: { $lt: now },
  });

  if (overdue.length === 0) return;

  const ids = overdue.map((business) => business._id);

  await Business.updateMany(
    { _id: { $in: ids } },
    {
      subscriptionStatus: "expired",
      featured: false,
    }
  );

  await Subscription.updateMany(
    { business: { $in: ids }, status: "active" },
    { status: "expired" }
  );
};

// =====================================
// GET PLANS
// GET /api/subscriptions/plans
// (public — used to render pricing)
// =====================================

router.get("/plans", (req, res) => {
  res.json({
    success: true,
    plans: Object.entries(PLANS).map(([key, value]) => ({
      key,
      ...value,
      listingLimit:
        value.listingLimit === Infinity
          ? "Unlimited"
          : value.listingLimit,
    })),
  });
});

// =====================================
// GET MY SUBSCRIPTIONS (business owner)
// GET /api/subscriptions/my
// =====================================

router.get("/my", protect, async (req, res) => {
  try {
    await expireOverdueSubscriptions();

    const subscriptions = await Subscription.find({
      owner: req.user._id,
    })
      .populate("business", "name subscriptionPlan subscriptionStatus subscriptionExpiresAt featured")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    console.error("Get my subscriptions error:", error);

    res.status(500).json({
      success: false,
      message: "Could not load your subscriptions.",
    });
  }
});

// =====================================
// SUBSCRIBE / UPGRADE
// POST /api/subscriptions/subscribe
// body: { businessId, plan, paymentMethod, transactionReference, receiptUrl }
// =====================================

router.post("/subscribe", protect, async (req, res) => {
  try {
    const {
      businessId,
      plan,
      paymentMethod,
      transactionReference,
      receiptUrl,
    } = req.body;

    if (!businessId || !plan) {
      return res.status(400).json({
        success: false,
        message: "Business and plan are required.",
      });
    }

    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected.",
      });
    }

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found.",
      });
    }

    if (
      business.owner &&
      business.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not own this business.",
      });
    }

    const amount = PLANS[plan].price;

    // FREE PLAN: activate instantly, no payment needed.
    if (plan === "Free" || amount === 0) {
      business.subscriptionPlan = "Free";
      business.subscriptionStatus = "active";
      business.subscriptionExpiresAt = null;
      business.featured = false;
      await business.save();

      const subscription = await Subscription.create({
        business: business._id,
        owner: req.user._id,
        plan,
        amount: 0,
        paymentMethod: "none",
        status: "active",
        startDate: new Date(),
        expiresAt: null,
      });

      return res.status(201).json({
        success: true,
        message: "Free plan activated.",
        subscription,
        business,
      });
    }

    if (!paymentMethod || !["telebirr", "chapa", "bank_transfer"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "A valid payment method is required for paid plans.",
      });
    }

    // CHAPA: create a hosted checkout session so the business
    // owner can pay online and get activated automatically.
    if (paymentMethod === "chapa") {
      if (!process.env.CHAPA_SECRET_KEY) {
        return res.status(503).json({
          success: false,
          message:
            "Online card/mobile payment isn't configured yet. Please use Telebirr or bank transfer for now.",
        });
      }

      const txRef = `melahub-${business._id}-${Date.now()}-${crypto
        .randomBytes(3)
        .toString("hex")}`;

      const subscription = await Subscription.create({
        business: business._id,
        owner: req.user._id,
        plan,
        amount,
        paymentMethod,
        status: "pending",
        chapaTxRef: txRef,
      });

      try {
        const chapaResponse = await fetch(
          "https://api.chapa.co/v1/transaction/initialize",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: String(amount),
              currency: "ETB",
              email: req.user.email,
              first_name: req.user.name?.split(" ")[0] || "MelaHub",
              last_name: req.user.name?.split(" ")[1] || "User",
              tx_ref: txRef,
              callback_url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/subscriptions/chapa/callback`,
              return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/my-business`,
              customization: {
                title: "MelaHub Sub",
                description: `${plan} plan subscription`,
              },
            }),
          }
        );

        const chapaData = await chapaResponse.json();

        if (chapaData.status !== "success") {
          throw new Error(
            chapaData.message || "Chapa did not return a checkout link."
          );
        }

        subscription.chapaCheckoutUrl = chapaData.data.checkout_url;
        await subscription.save();

        return res.status(201).json({
          success: true,
          message: "Redirect to Chapa to complete payment.",
          checkoutUrl: chapaData.data.checkout_url,
          subscription,
        });
      } catch (chapaError) {
        console.error("Chapa init error:", chapaError.message);

        return res.status(502).json({
          success: false,
          message:
            "Could not start the Chapa payment. Please try Telebirr or bank transfer instead.",
        });
      }
    }

    // TELEBIRR / BANK TRANSFER: manual — pending until admin approves.
    if (!transactionReference) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide the transaction reference / confirmation code for your payment.",
      });
    }

    const subscription = await Subscription.create({
      business: business._id,
      owner: req.user._id,
      plan,
      amount,
      paymentMethod,
      transactionReference: transactionReference.trim(),
      receiptUrl: receiptUrl?.trim() || "",
      status: "pending",
    });

    business.subscriptionStatus = "pending";
    await business.save();

    res.status(201).json({
      success: true,
      message:
        "Payment submitted. Your subscription will be activated once an admin verifies it.",
      subscription,
    });
  } catch (error) {
    console.error("Subscribe error:", error);

    res.status(500).json({
      success: false,
      message: "Could not process your subscription request.",
    });
  }
});

// =====================================
// CHAPA CALLBACK (server-to-server webhook)
// GET/POST /api/subscriptions/chapa/callback
// =====================================

const handleChapaCallback = async (req, res) => {
  try {
    const txRef = req.query.tx_ref || req.body.tx_ref;

    if (!txRef) {
      return res.status(400).json({ success: false, message: "Missing tx_ref." });
    }

    const subscription = await Subscription.findOne({ chapaTxRef: txRef });

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found." });
    }

    if (subscription.status === "active") {
      return res.json({ success: true, message: "Already activated." });
    }

    // Verify with Chapa before trusting the callback.
    const verifyResponse = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.status === "success" && verifyData.data.status === "success") {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + DAYS_30_MS);

      subscription.status = "active";
      subscription.startDate = now;
      subscription.expiresAt = expiresAt;
      subscription.reviewedAt = now;
      await subscription.save();

      await Business.findByIdAndUpdate(subscription.business, {
        subscriptionPlan: subscription.plan,
        subscriptionStatus: "active",
        subscriptionExpiresAt: expiresAt,
        featured: PLANS[subscription.plan]?.featured || false,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Chapa callback error:", error);
    res.status(500).json({ success: false, message: "Callback processing failed." });
  }
};

router.get("/chapa/callback", handleChapaCallback);
router.post("/chapa/callback", handleChapaCallback);

// =====================================
// ADMIN: LIST ALL SUBSCRIPTIONS
// GET /api/subscriptions/admin/all
// =====================================

router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    await expireOverdueSubscriptions();

    const subscriptions = await Subscription.find()
      .populate("business", "name category location")
      .populate("owner", "name email")
      .sort({ status: 1, createdAt: -1 });

    res.json({
      success: true,
      count: subscriptions.length,
      subscriptions,
    });
  } catch (error) {
    console.error("Admin get subscriptions error:", error);

    res.status(500).json({
      success: false,
      message: "Could not load subscriptions.",
    });
  }
});

// =====================================
// ADMIN: REVENUE STATS
// GET /api/subscriptions/admin/stats
// =====================================

router.get("/admin/stats", protect, adminOnly, async (req, res) => {
  try {
    await expireOverdueSubscriptions();

    const activeSubs = await Subscription.find({ status: "active" });
    const pendingCount = await Subscription.countDocuments({ status: "pending" });

    const mrr = activeSubs.reduce((sum, sub) => sum + (sub.amount || 0), 0);

    const byPlan = activeSubs.reduce((acc, sub) => {
      acc[sub.plan] = (acc[sub.plan] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      stats: {
        mrr,
        activeSubscribers: activeSubs.length,
        pendingCount,
        byPlan,
      },
    });
  } catch (error) {
    console.error("Admin subscription stats error:", error);

    res.status(500).json({
      success: false,
      message: "Could not load revenue stats.",
    });
  }
});

// =====================================
// ADMIN: APPROVE
// PATCH /api/subscriptions/admin/:id/approve
// =====================================

router.patch(
  "/admin/:id/approve",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const subscription = await Subscription.findById(req.params.id);

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "Subscription request not found.",
        });
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + DAYS_30_MS);

      subscription.status = "active";
      subscription.startDate = now;
      subscription.expiresAt = expiresAt;
      subscription.reviewedBy = req.user._id;
      subscription.reviewedAt = now;
      await subscription.save();

      const business = await Business.findByIdAndUpdate(
        subscription.business,
        {
          subscriptionPlan: subscription.plan,
          subscriptionStatus: "active",
          subscriptionExpiresAt: expiresAt,
          featured: PLANS[subscription.plan]?.featured || false,
        },
        { new: true }
      );

      res.json({
        success: true,
        message: "Subscription approved and activated.",
        subscription,
        business,
      });
    } catch (error) {
      console.error("Approve subscription error:", error);

      res.status(500).json({
        success: false,
        message: "Could not approve subscription.",
      });
    }
  }
);

// =====================================
// ADMIN: REJECT
// PATCH /api/subscriptions/admin/:id/reject
// =====================================

router.patch(
  "/admin/:id/reject",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { notes } = req.body;

      const subscription = await Subscription.findById(req.params.id);

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "Subscription request not found.",
        });
      }

      subscription.status = "rejected";
      subscription.notes = notes?.trim() || "";
      subscription.reviewedBy = req.user._id;
      subscription.reviewedAt = new Date();
      await subscription.save();

      await Business.findByIdAndUpdate(subscription.business, {
        subscriptionStatus: "none",
      });

      res.json({
        success: true,
        message: "Subscription request rejected.",
        subscription,
      });
    } catch (error) {
      console.error("Reject subscription error:", error);

      res.status(500).json({
        success: false,
        message: "Could not reject subscription.",
      });
    }
  }
);

module.exports = router;

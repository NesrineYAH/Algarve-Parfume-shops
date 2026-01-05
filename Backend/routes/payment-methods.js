const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET /api/payment-methods
router.get("/payment-methods", async (req, res) => {
  try {
    const user = req.user; // injecté par middleware auth

    if (!user || !user.stripeCustomerId) {
      return res.json([]);
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: "card",
    });

    res.json(paymentMethods.data);
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(500).json({ error: "Erreur récupération cartes" });
  }
});

module.exports = router;

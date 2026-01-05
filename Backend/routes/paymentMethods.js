const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const User = require("../Model/User");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET /payment-methods
router.get("/payment-methods", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.stripeCustomerId) {
      return res.json([]);
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: "card",
    });

    res.json(paymentMethods.data);
  } catch (err) {
    console.error("❌ Payment methods error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;


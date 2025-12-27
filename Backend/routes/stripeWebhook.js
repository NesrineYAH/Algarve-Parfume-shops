const express = require("express");
const Stripe = require("stripe");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ Stripe exige le RAW body
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature invalide", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Paiement confirmé
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("✅ Paiement confirmé par Stripe !");
      console.log("💳 Session ID :", session.id);
      console.log("📧 Email client :", session.customer_details?.email);
      console.log("💰 Montant payé :", session.amount_total / 100, "€");

      // 👉 ICI tu feras plus tard :
      // - enregistrer la commande en base
      // - marquer paid: true
      // - envoyer un email
    }

    res.json({ received: true });
  }
);

module.exports = router;

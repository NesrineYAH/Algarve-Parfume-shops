// Backend/routes/stripeWebhook.js
/*const express = require("express");
const Stripe = require("stripe");
const Order = require("../Model/Order");
require("dotenv").config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("✅ Webhook Stripe REÇU");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature invalide:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;

      if (!orderId) {
        console.error("❌ orderId manquant dans metadata");
        return res.status(400).json({ error: "orderId manquant" });
      }

      console.log("✅ Paiement confirmé pour la commande:", orderId);
      console.log("SESSION METADATA:", session.metadata);


      await Order.findByIdAndUpdate(orderId, {
        status: "paid",
        paymentStatus: "paid",
        paidAt: new Date(),
        stripeSessionId: session.id,
      });
    }

    res.json({ received: true });
  }
);

module.exports = router;
*/
// Backend/routes/stripeWebhook.js
const express = require("express");
const Stripe = require("stripe");
const Order = require("../Model/Order");
require("dotenv").config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// IMPORTANT : ce route doit être AVANT express.json() dans server.js
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("📩 Webhook Stripe reçu");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Signature webhook invalide :", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // -----------------------------
    // 1️⃣ Paiement réussi
    // -----------------------------
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("❌ orderId manquant dans metadata");
        return res.status(400).json({ error: "orderId manquant" });
      }

      try {
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            status: "paid",
            paymentStatus: "paid",
            paidAt: new Date(),
            stripeSessionId: session.id,
          },
          { new: true }
        );

        console.log("✅ Commande PAYÉE :", updatedOrder._id);
      } catch (err) {
        console.error("❌ Erreur mise à jour commande :", err.message);
      }
    }

    // -----------------------------
    // 2️⃣ Paiement annulé / expiré
    // -----------------------------
    if (
      event.type === "checkout.session.expired" ||
      event.type === "checkout.session.async_payment_failed"
    ) {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("❌ orderId manquant dans metadata");
        return res.status(400).json({ error: "orderId manquant" });
      }

      try {
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            status: "cancelled",
            paymentStatus: "unpaid",
            cancelledAt: new Date(),
          },
          { new: true }
        );

        console.log("⚠️ Commande ANNULÉE :", updatedOrder._id);
      } catch (err) {
        console.error("❌ Erreur mise à jour commande annulée :", err.message);
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;








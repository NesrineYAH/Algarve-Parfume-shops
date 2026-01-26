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
      const orderId = session.metadata.orderId; 
      await Order.findByIdAndUpdate(orderId, { 
        status: "paid", 
        paymentStatus: "paid", 
        paidAt: new Date(), 
        stripeSessionId: session.id, 
      });
      /*
            if (!orderId) {
              console.error("❌ orderId manquant dans metadata");
              return res.status(400).json({ error: "orderId manquant" });
            }
      */
      console.log("✅ Paiement confirmé pour order:", orderId);

      try {
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            status: "confirmed",       // ou "paid" si tu veux
            paymentStatus: "paid",
            paidAt: new Date(),
            stripeSessionId: session.id,
          },
          { new: true }
        );

        console.log("💾 Commande mise à jour :", updatedOrder._id);
      } catch (err) {
        console.error("❌ Erreur mise à jour commande :", err.message);
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;







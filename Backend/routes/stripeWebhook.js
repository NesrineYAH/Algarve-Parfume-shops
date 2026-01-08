const express = require("express");
const Stripe = require("stripe");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * ⚠️ IMPORTANT
 * - Cette route DOIT être montée avec express.raw()
 * - PAS de authMiddleware
 * - PAS de express.json()
 */
router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature invalide :", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("📩 Webhook reçu :", event.type);

  // ✅ Paiement Checkout confirmé
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      console.log("✅ Paiement confirmé !");
      console.log("🧾 Session ID :", session.id);
      console.log("👤 Customer :", session.customer);

      // 1️⃣ Récupérer le PaymentIntent
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );

      // 2️⃣ Attacher la carte au customer
      await stripe.paymentMethods.attach(
        paymentIntent.payment_method,
        {
          customer: session.customer,
        }
      );

      // 3️⃣ Définir la carte par défaut (recommandé)
      await stripe.customers.update(session.customer, {
        invoice_settings: {
          default_payment_method: paymentIntent.payment_method,
        },
      });

      console.log("💾 Carte sauvegardée avec succès !");
    } catch (err) {
      console.error("❌ Erreur traitement checkout :", err);
      return res.status(500).json({ error: "Webhook processing failed" });
    }
  }

  // 🔔 Toujours répondre 200 à Stripe
  res.json({ received: true });
});

module.exports = router;



/*
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("✅ Paiement confirmé par Stripe !");
    console.log("💳 Session ID :", session.id);
    console.log("📧 Email client :", session.customer_details?.email);
    console.log("💰 Montant payé :", session.amount_total / 100, "€");
  }



*/
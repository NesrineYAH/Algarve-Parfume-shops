const express = require("express");
const Stripe = require("stripe");
const Payment = require("../Model/Payment");
const Cart = require("../Model/Cart");
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;

    console.log("✅ Paiement confirmé pour userId:", userId);

    // Récupérer le panier
    const cart = await Cart.findOne({ userId });
    if (cart && cart.items.length > 0) {
      // Créer un document Payment
      const payment = new Payment({
        user: userId,
        amount: session.amount_total / 100,
        currency: session.currency,
        items: cart.items.map((item) => ({
          productId: item.productId,
          nom: item.nom,
          quantite: item.quantite,
          prix: item.options.prix,
          size: item.options.size,
          unit: item.options.unit,
        })),
        stripeSessionId: session.id,
      });

      await payment.save();
      console.log("💾 Paiement enregistré dans MongoDB");

      // Vider le panier
      cart.items = [];
      await cart.save();
    }
  }

  res.json({ received: true });
});

module.exports = router;





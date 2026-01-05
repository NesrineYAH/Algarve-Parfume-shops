const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route création session Stripe
router.post("/create-checkout-session", async (req, res) => {
    console.log("USER:", req.user);
  try {
    const { cart } = req.body;
    const user = req.user; // injecté par authMiddleware

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Panier invalide" });
    }

    // ✅ 1. RÉCUPÉRER OU CRÉER LE CUSTOMER STRIPE
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });

      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    // ✅ 2. CRÉER LES LINE ITEMS
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.nom || "Produit",
        },
        unit_amount: Math.round(item.options.prix * 100),
      },
      quantity: item.quantite || 1,
    }));

    // ✅ 3. CRÉER LA SESSION CHECKOUT
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      line_items,
      payment_intent_data: {
        setup_future_usage: "off_session", // 🔥 sauvegarde la carte
      },
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    console.log("✅ Session Stripe créée :", session.id);
    console.log("➡️ URL Stripe :", session.url);

    res.json({ url: session.url });

  } catch (err) {
    console.error("❌ Stripe error:", err);
    res.status(500).json({ error: "Erreur Stripe" });
  }
});

module.exports = router;


/*

const session = await stripe.checkout.sessions.create({
  mode: "payment",
  customer: stripeCustomerId, // 👈 OBLIGATOIRE
  payment_method_types: ["card"],
  line_items,
  success_url: "http://localhost:5173/success",
  cancel_url: "http://localhost:5173/cancel",

  payment_intent_data: {
    setup_future_usage: "off_session", // 🔥 SAUVEGARDE LA CARTE
  },
});



////////////////////// encien session 
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });





*/
const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route création session Stripe
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Panier invalide" });
    }

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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    console.log("✅ Session Stripe créée :", session.id);
    console.log("➡️ URL Stripe :", session.url);

    // 🔥 IMPORTANT
    res.json({ url: session.url });

  } catch (err) {
    console.error("❌ Stripe error:", err);
    res.status(500).json({ error: "Erreur Stripe" });
  }
});



module.exports = router;

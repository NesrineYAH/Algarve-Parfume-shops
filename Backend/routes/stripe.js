const express = require("express");
const Stripe = require("stripe");
const User = require("../Model/User");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * GET /api/payment-methods
 * 🔐 Auth requis
 * 📄 Retourne les cartes sauvegardées Stripe
 */
router.get("/payment-methods", async (req, res) => {
  try {
    // 1️⃣ Récupération utilisateur
    const user = await User.findById(req.user.id);
   console.log("USER AUTH :", req.user);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (!user.stripeCustomerId) {
      return res.json([]);
    }

    // 2️⃣ Récupération des cartes Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: "card",
    });

    // 3️⃣ Format de réponse frontend-friendly
    const cards = paymentMethods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      exp_month: pm.card.exp_month,
      exp_year: pm.card.exp_year,
      isDefault: pm.id === pm.customer?.invoice_settings?.default_payment_method,
    }));

    res.json(cards);
  } catch (err) {
    console.error("❌ Payment methods error :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;

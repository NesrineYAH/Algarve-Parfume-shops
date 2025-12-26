const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route création session Stripe
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart } = req.body;

    console.log("Cart reçu :", cart); // doit être un tableau

    // Vérification du panier
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Le panier est vide ou invalide" });
    }

    // Préparation des items pour Stripe
    const line_items = cart.map((item) => {
      const amount = Math.round(Number(item.options?.prix || 0) * 100);
      const quantity = Number(item.quantite || 1);

      if (!amount || !quantity) {
        throw new Error(`Item invalide: ${item.nom}`);
      }

      return {
        price_data: {
          currency: "eur",
          product_data: { name: item.nom || "Produit" },
          unit_amount: amount,
        },
        quantity,
      };
    });

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    console.log("Session Stripe créée :", session.id);

    // Envoi de l'ID de session au frontend
    res.json({ id: session.id });
  } catch (err) {
    console.error("Erreur Stripe :", err);
    res.status(500).json({ error: "Erreur création session Stripe" });
  }
});

module.exports = router;

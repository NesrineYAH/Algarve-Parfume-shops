const express = require("express");
const Stripe = require("stripe");
const User = require("../Model/User");
const Cart = require("../Model/Cart");
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    // 1️⃣ Récupérer le user
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // 2️⃣ Récupérer le panier
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    // 3️⃣ Créer customer Stripe si nécessaire
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // 4️⃣ Créer les line_items pour Stripe
    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.nom,
          description: `Option: ${item.options.size}${item.options.unit}`,
          images: item.imageUrl ? [`http://localhost:5001${item.imageUrl}`] : []
        },
        unit_amount: item.options.prix * 100, // en centimes
      },
      quantity: item.quantite,
    }));

    // 5️⃣ Créer la session Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items,
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe checkout error :", err);
    res.status(500).json({ message: "Stripe error" });
  }
});

module.exports = router;



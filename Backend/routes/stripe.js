//Backend/routes/stripe.js
const express = require("express");
const Stripe = require("stripe");
const User = require("../Model/User");
const Cart = require("../Model/Cart");
const Order = require("../Model/Order");
const { authMiddleware } = require("../middleware/auth");
const { sendEmail } = require("../utils/mailer");
const generateInvoice = require("../utils/generateInvoiceBuffer");
const Address = require("../Model/Address");
const fs = require("fs");


const router = express.Router();
require("dotenv").config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const FRONT_URL = "http://localhost:5173";
const BACK_URL = "http://localhost:5001";

router.post("/checkout-from-cart", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const cart = await Cart.findOne({ userId: user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    const totalPrice = cart.items.reduce((sum, item) => {
      const price =
        parseFloat(item.options.prix.toString().replace(",", ".")) || 0;
      return sum + price * item.quantite;
    }, 0);

    const order = await Order.create({
      userId: user._id,
      items: cart.items,
      status: "pending",
      paymentStatus: "unpaid",
      totalPrice,
    });

    cart.items = [];
    await cart.save();

    // Créer le client Stripe si nécessaire
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.prenom} ${user.nom}`,
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Préparer les items pour Stripe
    const line_items = order.items.map(item => {
      const price =
        parseFloat(item.options.prix.toString().replace(",", ".")) || 0;

      return {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(price * 100),
          product_data: {
            name: item.nom,
            description: `Option ${item.options.size}${item.options.unit}`,
            images: item.imageUrl
              ? [encodeURI(`${BACK_URL}${item.imageUrl}`)]
              : [],
          },
        },
        quantity: item.quantite,
      };
    });


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: user.stripeCustomerId,
      line_items,
      success_url: `${FRONT_URL}/success?orderId=${order._id}`,
      cancel_url: `${FRONT_URL}/orders`,
      metadata: { orderId: order._id.toString(), userId: user._id.toString() },
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("❌ Stripe cart checkout error:", err);
    res.status(500).json({ message: "Stripe error", detail: err.message });
  }
});

router.post("/checkout-order/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Commande introuvable" });

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Commande déjà payée" });
    }

    const user = await User.findById(order.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({ email: user.email });
      user.stripeCustomerId = customer.id;
      await user.save();
    }
    const line_items = order.items.map(item => {
      const price =
        parseFloat(item.options.prix.toString().replace(",", ".")) || 0;

      return {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(price * 100),
          product_data: {
            name: item.nom,
            description: `Option ${item.options.size}${item.options.unit}`,
            images: item.imageUrl
              ? [encodeURI(`${BACK_URL}${item.imageUrl}`)]
              : [],
          },
        },
        quantity: item.quantite,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: user.stripeCustomerId,
      line_items,
      success_url: `${FRONT_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order._id}`,
      cancel_url: `${FRONT_URL}/orders`,
      metadata: { orderId: order._id.toString(), userId: user._id.toString() },
    });
    ;

    res.json({ url: session.url });

  } catch (err) {
    console.error("🔥 STRIPE ERROR:", err);
    res.status(500).json({ message: "Stripe error", detail: err.message });
  }
});

router.post("/orders/confirm-payment", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId manquant" });
    }
    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // Vérifier que Stripe confirme le paiement
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Paiement non confirmé par Stripe" });
    }

    const orderId = session.metadata.orderId;

    // Mettre à jour la commande
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "confirmed",
        paymentStatus: "paid",
        paidAt: new Date(),
        stripeSessionId: session.id,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    res.json({ message: "Paiement confirmé", order });

  } catch (err) {
    console.error("❌ Erreur confirm-payment :", err);
    res.status(500).json({ message: "Erreur serveur", detail: err.message });
  }
});

router.post("/create-setup-intent", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.prenom} ${user.nom}`,
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
      payment_method_types: ["card"],
      setup_future_usage: "off_session",
    });

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: "Erreur création SetupIntent" });
  }
});

module.exports = router;




/* <img src="${BACK_URL}${item.imageUrl}" width="80" style="border-radius:5px;" />  */
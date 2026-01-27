const express = require("express");
const Stripe = require("stripe");
const User = require("../Model/User");
const Cart = require("../Model/Cart");
const Order = require("../Model/Order");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();
require("dotenv").config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const FRONT_URL = "http://localhost:5173";
const BACK_URL = "http://localhost:5001";

// 🅰️ Checkout depuis le panier
router.post("/checkout-from-cart", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const cart = await Cart.findOne({ userId: user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    //    const totalPrice = cart.items.reduce((sum, item) => sum + item.options.prix * item.quantite, 0);
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
      const customer = await stripe.customers.create({ email: user.email });
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

// 🅱️ Checkout depuis une commande existante
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
      //      success_url: `${FRONT_URL}/success?orderId=${order._id}`,
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

// Webhook Stripe pour confirmer le paiement
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("❌ Webhook signature invalide", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      await Order.findByIdAndUpdate(orderId, {
        status: "confirmed",
        paymentStatus: "paid",
        paidAt: new Date(),
        stripeSessionId: session.id,
      });

      console.log("✅ Paiement confirmé pour order:", orderId);
    }

    res.json({ received: true });
  }
);
// Webhook Stripe pour confirmer le paiement
router.post("/orders/confirm-payment", authMiddleware, async (req, res) => {
  const { sessionId } = req.body;

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return res.status(400).json({ message: "Paiement non confirmé" });
  }

  const orderId = session.metadata.orderId;

  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      paymentStatus: "paid",
      status: "paid",
      paidAt: new Date(),
      stripeSessionId: session.id,
    },
    { new: true }
  );

  res.json({ order });
});


module.exports = router;






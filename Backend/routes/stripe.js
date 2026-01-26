const express = require("express");
const Stripe = require("stripe");
const User = require("../Model/User");
const Cart = require("../Model/Cart");
const Order = require("../Model/Order");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log(process.env.STRIPE_SECRET_KEY)

const FRONT_URL = "http://localhost:5173";
const BACK_URL = "http://localhost:5001";


// 🅰️ PANIER → COMMANDE (pending) → STRIPE CHECKOUT
router.post("/checkout-from-cart", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    console.log("req.user.userId =", req.user.userId);

    const cart = await Cart.findOneAndUpdate({ userId: user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    // 🧾 Création de la commande (pending)
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.options.prix * item.quantite,
      0
    );

    const order = await Order.create({
      user: user._id,
      items: cart.items,
      status: "pending",
      paymentStatus: "unpaid",
      totalPrice,
    });

    // 🧹 Vider le panier immédiatement
    cart.items = [];
    await cart.save();

    // 👤 Customer Stripe
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // 🧾 Stripe line_items depuis la COMMANDE
    const line_items = order.items.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.nom,
          description: `Option ${item.options.size}${item.options.unit}`,
          images: item.imageUrl ? [`${BACK_URL}${item.imageUrl}`] : [],
        },
        //      unit_amount: item.options.prix * 100,
        unit_amount: Math.round(Number(item.options.prix) * 100)

      },
      quantity: item.quantite,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: user.stripeCustomerId, // ✅ BON NOM
      line_items,
      success_url: `${FRONT_URL}/success`,
      cancel_url: `${FRONT_URL}/orders`,
      metadata: {
        orderId: order._id.toString(),
        userId: user._id.toString(),
      },
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("❌ Stripe cart checkout error:", err);
    res.status(500).json({ message: "Stripe error" });
  }
});
// 🅱️ COMMANDE PENDING → STRIPE CHECKOUT
router.post("/checkout-order/:orderId", authMiddleware, async (req, res) => {
  try {
    // 1️⃣ Récupérer la commande
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    // 2️⃣ Vérifier si la commande est déjà payée
    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Commande déjà payée" });
    }

    // 3️⃣ Récupérer l'utilisateur associé
    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // 4️⃣ Créer le client Stripe si nécessaire
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({ email: user.email });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // 5️⃣ Préparer les items pour Stripe
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: "eur",
        unit_amount: Math.round(parseFloat(item.options.prix.toString().replace(",", ".")) * 100),
        product_data: {
          name: item.nom,
          images: [
            encodeURI(`http://localhost:5001${item.imageUrl}`)
          ],
        },
      },
      quantity: item.quantite,
    }));

    console.log("Stripe line_items:", line_items);


    // 6️⃣ Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: user.stripeCustomerId,
      line_items,
      success_url: `${FRONT_URL}/success`,
      cancel_url: `${FRONT_URL}/orders`,
      metadata: {
        orderId: order._id.toString(),
        userId: order.userId.toString(),
      },
    });

    // 7️⃣ Retourner l'URL de Stripe au frontend
    res.json({ url: session.url });

  } catch (err) {
    console.error("🔥 STRIPE ERROR:", err);
    res.status(500).json({ message: "Stripe error", detail: err.message });
  }
});


// 🔔 WEBHOOK STRIPE — CONFIRMATION PAIEMENT
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
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
      const orderId = session.metadata.orderId;

      console.log("✅ Paiement confirmé pour order:", orderId);

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




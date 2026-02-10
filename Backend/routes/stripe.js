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
      const userId = session.metadata.userId;

      // 1️⃣ Récupérer la commande
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });

      // 2️⃣ Récupérer l'utilisateur
      const user = await User.findById(userId);

      // 3️⃣ Récupérer l'adresse de livraison
      const shippingAddress = await Address.findOne({
        userId,
        type: "shipping"
      });

      const addressHtml = shippingAddress
        ? `
        <p style="font-size:15px; color:#555;">
          ${shippingAddress.street}<br/>
          ${shippingAddress.postalCode} ${shippingAddress.city}<br/>
          ${shippingAddress.country}
        </p>`
        : `<p style="color:#999;">Aucune adresse de livraison enregistrée.</p>`;

      // 4️⃣ Construire le tableau HTML des articles
      const itemsHtml = order.items
        .map(item => {
          const total = parseFloat(item.options.prix) * item.quantite;
          return `
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee;">
                <img src="http://localhost:5001/uploads/${item.imageUrl}" style="border-radius:5px, width="80" />

              </td>
              <td style="padding:10px; border-bottom:1px solid #eee;">
                <strong>${item.nom}</strong><br/>
                Option : ${item.options.size}${item.options.unit}<br/>
                Quantité : ${item.quantite}
              </td>
              <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">
                ${total.toFixed(2)} € 
              </td>
            </tr>
          `;
        })
        .join("");

      // 5️⃣ Générer la facture PDF dans public/invoices
      const invoicePath = await generateInvoice(order, user, shippingAddress);
      //      order.invoiceUrl = `/invoices/invoice-${order._id}.pdf`;
      //          await order.save();


      // 6️⃣ Mettre à jour la commande
      await Order.findByIdAndUpdate(orderId, {
        status: "confirmed",
        paymentStatus: "paid",
        paidAt: new Date(),
        stripeSessionId: session.id,
        invoiceUrl: `/invoices/invoice-${order._id}.pdf`
      });

      // 7️⃣ ENVOYER L’EMAIL
      await sendEmail({
        to: user.email,
        subject: "Votre commande a été confirmée",
        html: `
          <div style="font-family:Arial, sans-serif; padding:20px; background:#f7f7f7;">
            <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:8px;">

              <h1 style="text-align:center; color:#333;">Merci pour votre achat !</h1>

              <p style="font-size:16px; color:#555;">
                Bonjour ${user.prenom},<br/>
                Votre commande <strong>#${orderId}</strong> du 
                <strong>${order.createdAt.toLocaleDateString()}</strong> a bien été payée.
              </p>

              <h3 style="margin-top:20px; color:#333;">Adresse de livraison</h3>
              ${addressHtml}

              <h3 style="margin-top:20px; color:#333;">Détails de la commande</h3>

              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                ${itemsHtml}
              </table>

              <p style="font-size:18px; font-weight:bold; text-align:right; margin-top:20px;">
                Total : ${order.totalPrice} €
              </p>

            </div>
          </div>
        `,
        attachments: [
          {
            filename: `facture-${orderId}.pdf`,
            path: invoicePath,
            contentType: "application/pdf"
          }
        ]
      });
      console.log("📧 Email envoyé à :", user.email);

    }

    res.json({ received: true });
  }
);

// ⚠️ Route à utiliser uniquement en fallback (pas en production)
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

//stripe enregistrer un moyen de paiement
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
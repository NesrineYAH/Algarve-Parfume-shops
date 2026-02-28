// controllers/paypal.controller.js
const fetch = require("node-fetch");
const Order = require("../Model/Order");

// 🌟 Créer une commande PayPal
const createOrder = async (req, res) => {
    const { total, orderId } = req.body;

    try {
        // 1️⃣ Récupérer user depuis JWT
        const userId = req.user.userId;
        console.log("Body reçu :", req.body);
        console.log("User ID :", req.user.userId);
        
        // 2️⃣ Vérifier que la pré-commande existe
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Pré-commande introuvable" });

        // 3️⃣ Obtenir access token PayPal
        const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
        const tokenRes = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
        });
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        // 4️⃣ Créer l’ordre PayPal
        const orderRes = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        reference_id: orderId,
                        amount: {
                            currency_code: "EUR",
                            value: total.toFixed(2),
                        },
                    },
                ],
            }),
        });

        const orderData = await orderRes.json();

        if (!orderData.id) {
            return res.status(500).json({ error: "PayPal order ID manquant" });
        }

        // 5️⃣ Retourner uniquement l’ID à frontend
        res.json({ id: orderData.id });
    } catch (error) {
        console.error("PayPal create order error:", error);
        res.status(500).json({ error: "Erreur création ordre PayPal" });
    }
};

// 🌟 Capturer la commande PayPal après approbation
const captureOrder = async (req, res) => {
    const { orderID, orderId } = req.body; // orderID = PayPal, orderId = MongoDB

    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Pré-commande introuvable" });

        // Obtenir access token PayPal
        const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
        const tokenRes = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
        });
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        // Capture le paiement
        const captureRes = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        const captureData = await captureRes.json();

        if (captureData.status !== "COMPLETED") {
            return res.status(400).json({ error: "Échec de capture du paiement PayPal" });
        }

        // Mettre à jour la commande MongoDB
        order.paymentStatus = "paid";
        order.paidAt = new Date();
        await order.save();

        res.json({ success: true, order });
    } catch (error) {
        console.error("PayPal capture order error:", error);
        res.status(500).json({ error: "Erreur capture PayPal" });
    }
};

module.exports = { createOrder, captureOrder };
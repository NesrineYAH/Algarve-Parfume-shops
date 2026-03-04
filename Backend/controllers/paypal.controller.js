// controllers/paypal.controller.js
const fetch = require("node-fetch");
const Order = require("../Model/Order");
require("dotenv").config();

// 🌟 Fonction utilitaire pour obtenir le token PayPal
const getPaypalToken = async () => {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
    const tokenRes = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    const data = await tokenRes.json();
    console.log("PayPal token response:", data); // log utile pour debug

    const { access_token } = data;
    if (!access_token) throw new Error("Impossible d'obtenir le token PayPal");
    return access_token;
};

// 🌟 Créer une commande PayPal
const createOrder = async (req, res) => {
    const { orderId } = req.body;

    try {
        if (!orderId) return res.status(400).json({ error: "orderId manquant" });

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Pré-commande introuvable" });

        const total = order.totalPrice;
        if (!total || isNaN(total)) return res.status(400).json({ error: "Total invalide" });

        // Obtenir token PayPal
        const accessToken = await getPaypalToken();


        // Créer la commande PayPal
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
        console.log("CLIENT ID:", process.env.PAYPAL_CLIENT_ID);
        console.log("SECRET:", process.env.PAYPAL_CLIENT_SECRET ? "OK" : "MISSING");
        
        const orderResText = await orderRes.text();
        let orderData;
        try {
            orderData = JSON.parse(orderResText);
        } catch {
            console.error("Erreur parsing PayPal order response:", orderResText);
            return res.status(500).json({ error: "Erreur parsing réponse PayPal" });
        }

        if (!orderData.id) {
            console.error("PayPal response:", orderData);
            return res.status(500).json({ error: "PayPal order ID manquant" });
        }

        res.json({ id: orderData.id });

    } catch (error) {
        console.error("PayPal create order error:", error);
        res.status(500).json({ error: "Erreur création ordre PayPal" });
    }
};

// 🌟 Capturer la commande PayPal après approbation
const captureOrder = async (req, res) => {
    const { orderID, orderId } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Pré-commande introuvable" });

        // Obtenir token PayPal
        const accessToken = await getPaypalToken();

        // Capture le paiement
        const captureRes = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        const captureResText = await captureRes.text();
        let captureData;
        try {
            captureData = JSON.parse(captureResText);
        } catch {
            console.error("Erreur parsing PayPal capture response:", captureResText);
            return res.status(500).json({ error: "Erreur parsing capture PayPal" });
        }

        console.log("CAPTURE DATA:", captureData);

        // Vérifier que la commande est bien complétée
        if (captureData.status !== "COMPLETED") {
            return res.status(400).json({ error: "Échec de capture du paiement PayPal" });
        }

        const purchaseUnit = captureData.purchase_units?.[0];
        const paymentCaptured = purchaseUnit?.payments?.captures?.[0]?.status === "COMPLETED";

        if (!paymentCaptured) {
            return res.status(400).json({ error: "Paiement non complété" });
        }

        // Mettre à jour la commande MongoDB
        order.status = "confirmed";
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
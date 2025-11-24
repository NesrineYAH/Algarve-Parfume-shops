const express = require("express");
const router = express.Router();
const Order = require("../Model/Order");
const authMiddleware = require("../middleware/auth");

// Créer une nouvelle commande
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { items, totalPrice, addresses } = req.body;

        const order = new Order({
            userId: req.user.userId, // récupéré depuis authMiddleware
            items,
            totalPrice,
            addresses,
        });

        await order.save();

        res.status(201).json({ message: "Commande créée", order });
    } catch (error) {
        console.error("Erreur création commande :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Récupérer toutes les commandes
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email"); // populate user info si besoin
        res.status(200).json(orders);
    } catch (error) {
        console.error("Erreur récupération commandes :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;

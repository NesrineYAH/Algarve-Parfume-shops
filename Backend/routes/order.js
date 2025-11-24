import express from "express";
import Order from "../Model/Order.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Créer une commande
router.post("/create", auth, async (req, res) => {
    try {
        const { items, totalPrice, address } = req.body;

        const order = new Order({
            userId: req.user.id,
            items,
            totalPrice,
            address
        });

        await order.save();

        res.status(201).json({ message: "Commande créée", order });
    } catch (error) {
        console.error("Erreur création commande :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;

const express = require("express");
const router = express.Router();
const Order = require("../Model/Order");
const { authMiddleware } = require("../middleware/auth");
const Product = require("../Model/product"); // Assure-toi que ce modèle existe et est bien importé




// ➤ CRÉATION D’UNE COMMANDE
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { items, totalPrice, delivery } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Aucun article dans la commande" });
        }

        // Construire correctement les items avec nom + option
        const enrichedItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error(`Produit introuvable : ${item.productId}`);

                // trouver l'option dans le produit
                const option = product.options.find(opt => opt.quantity === item.option.quantity);
                if (!option) throw new Error(`Option introuvable pour le produit : ${product.nom}`);

                return {
                    productId: product._id,
                    nom: product.nom,
                    quantity: item.quantity,
                    imageUrl: product.imageUrl,
                    option: {
                        quantity: option.quantity,
                        prix: option.prix,
                        stock: option.stock
                    }
                };
            })
        );

        const order = new Order({
            userId: req.user.userId,
            items: enrichedItems,
            totalPrice,
            delivery,
            paymentStatus: "pending",
        });

        await order.save();

        res.status(201).json({ message: "Commande créée avec succès", order });

    } catch (error) {
        console.error("Erreur création commande :", error);
        res.status(500).json({ error: "Erreur serveur", detail: error.message });
    }
});



// ➤ RÉCUPÉRER TOUTES LES COMMANDES DE TOUS LES UTILISATEURS (ADMIN)
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email");
        res.status(200).json(orders);
    } catch (error) {
        console.error("Erreur récupération commandes :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// ➤ RÉCUPÉRER LES COMMANDES D’UN UTILISATEUR
router.get("/my-orders", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Erreur récupération commandes utilisateur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// ➤ METTRE À JOUR UNE COMMANDE (statut, livraison…)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { status, delivery, paymentStatus } = req.body;

        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            { status, delivery, paymentStatus },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        res.status(200).json({ message: "Commande mise à jour", order: updated });
    } catch (error) {
        console.error("Erreur mise à jour commande :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// ➤ SUPPRESSION D’UNE COMMANDE
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        res.status(200).json({ message: "Commande supprimée" });
    } catch (error) {
        console.error("Erreur suppression commande :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


module.exports = router;


























/*
const express = require("express");
const router = express.Router();
const Order = require("../Model/Order");
const { authMiddleware } = require("../middleware/auth");

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
*/
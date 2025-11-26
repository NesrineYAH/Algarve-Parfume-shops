const express = require("express");
const router = express.Router();
const Order = require("../Model/Order");
const { authMiddleware } = require("../middleware/auth");
const Product = require("../Model/product"); // Assure-toi que ce modèle existe et est bien importé


// Créer une nouvelle commande
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { items, totalPrice, address } = req.body;

        // Enrichir chaque item avec les infos du produit
        const enrichedItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error(`Produit introuvable : ${item.productId}`);

                return {
                    productId: item.productId,
                    name: product.nom,
                    prix: product.prix,
                    imageUrl: product.imageUrl,
                    quantity: item.quantity,
                };
            })
        );

        const order = new Order({
            userId: req.user.userId,
            items: enrichedItems,
            totalPrice,
            address,
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
        const orders = await Order.find().populate("userId", "name email");
        res.status(200).json(orders);
    } catch (error) {
        console.error("Erreur récupération commandes :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
// ➤ Modifier une commande (ex: adresse ou statut)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { address, status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { address, status },
            { new: true } // retourne la commande mise à jour
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        res.status(200).json({ message: "Commande mise à jour", order: updatedOrder });
    } catch (error) {
        console.error("Erreur mise à jour commande :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
// ➤ Supprimer une commande
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        res.status(200).json({ message: "Commande supprimée avec succès" });
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
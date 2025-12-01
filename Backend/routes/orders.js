const express = require("express");
const router = express.Router();
const Order = require("../Model/Order");
const Product = require("../Model/product");
const { authMiddleware } = require("../middleware/auth");

// ➤ CRÉATION D’UNE COMMANDE
router.post("/create", authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const { items, totalPrice, delivery } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ message: "Aucun article dans la commande" });
        }

        const enrichedItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error(`Produit introuvable : ${item.productId}`);

                // Assurer que options existe
                const optSize = item.options?.size;
                const optUnit = item.options?.unit || "ml";

                if (!optSize) {
                    throw new Error(`Options manquantes ou invalides pour le produit : ${product.nom}`);
                }

                // Recherche de l'option dans le produit
                const selectedOption = product.options.find(
                    (opt) =>
                        Number(opt.size) === Number(optSize) &&
                        opt.unit.toLowerCase() === optUnit.toLowerCase()
                );

                if (!selectedOption) {
                    throw new Error(
                        `Option invalide pour le produit : ${product.nom}. Options disponibles: ${JSON.stringify(
                            product.options
                        )}`
                    );
                }

                return {
                    productId: product._id,
                    nom: product.nom,
                    imageUrl: product.imageUrl,
                    quantite: Number(item.quantite || 1),
                    options: {
                        size: selectedOption.size,
                        unit: selectedOption.unit,
                        prix: selectedOption.prix
                    }
                };
            })
        );

        const order = new Order({
            userId: req.user.userId,
            items: enrichedItems,
            totalPrice: Number(totalPrice || 0),
            status: "pending",
            delivery,
            paymentStatus: "pending"
        });

        await order.save();

        res.status(201).json({ message: "Commande créée avec succès", order });
    } catch (error) {
        console.error("Erreur création commande :", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ➤ RÉCUPÉRER TOUTES LES COMMANDES (ADMIN)
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email");
        res.status(200).json(orders);
    } catch (error) {
        console.error("Erreur récupération commandes :", error.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ➤ RÉCUPÉRER LES COMMANDES D’UN UTILISATEUR
router.get("/my-orders", authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const orders = await Order.find({ userId: req.user.userId });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Erreur récupération commandes utilisateur :", error.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ➤ METTRE À JOUR UNE COMMANDE
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { status, delivery, paymentStatus } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status, delivery, paymentStatus },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        res.status(200).json({ message: "Commande mise à jour", order: updatedOrder });
    } catch (error) {
        console.error("Erreur mise à jour commande :", error.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ➤ SUPPRIMER UNE COMMANDE
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        res.status(200).json({ message: "Commande supprimée" });
    } catch (error) {
        console.error("Erreur suppression commande :", error.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;

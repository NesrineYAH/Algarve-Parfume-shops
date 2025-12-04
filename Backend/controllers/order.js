const Order = require("../Model/Order");
const Product = require("../Model/product");
const mongoose = require("mongoose");

// ➤ CRÉER UNE PRÉ-COMMANDE OU COMMANDE
exports.createOrder = async (req, res) => {
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

                const optSize = item.options?.size;
                const optUnit = item.options?.unit || "ml";

                if (!optSize) {
                    throw new Error(`Options manquantes ou invalides pour le produit : ${product.nom}`);
                }

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
                        prix: selectedOption.prix,
                    },
                };
            })
        );

        const order = new Order({
            userId: req.user.userId,
            items: enrichedItems,
            totalPrice: Number(totalPrice || 0),
            status: "pending",
            paymentStatus: "pending",
            delivery,
        });

        await order.save();
        res.status(201).json({ message: "Commande créée avec succès", order });
    } catch (error) {
        console.error("Erreur création commande :", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ➤ METTRE À JOUR UNE COMMANDE
exports.updateOrder = async (req, res) => {
    try {
        const { status, delivery, paymentStatus, items, totalPrice } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (delivery) updateData.delivery = delivery;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (items) updateData.items = items;
        if (totalPrice) updateData.totalPrice = totalPrice;

        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        res.status(200).json({ message: "Commande mise à jour", order: updatedOrder });
    } catch (error) {
        console.error("Erreur mise à jour commande :", error.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ➤ FINALISER UNE COMMANDE
exports.finalizeOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Commande introuvable" });

        order.status = "confirmed";
        order.paymentStatus = "paid";
        await order.save();

        res.status(200).json({ message: "Commande finalisée", order });
    } catch (error) {
        console.error("Erreur finalisation commande :", error.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ➤ RÉCUPÉRER LES COMMANDES DE L’UTILISATEUR CONNECTÉ
exports.getMyOrders = async (req, res) => {
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
};

// ➤ SUPPRIMER UNE COMMANDE
exports.deleteOrder = async (req, res) => {
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
};

// ➤ RÉCUPÉRER TOUTES LES COMMANDES (ADMIN)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "email nom prenom");
        res.status(200).json(orders);
    } catch (error) {
        console.error("Erreur récupération commandes :", error.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ➤ RÉCUPÉRER LES COMMANDES D’UN UTILISATEUR PAR SON ID
exports.getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
        }

        const allOrders = await Order.find({ userId });
        const preOrders = allOrders.filter((o) => o.status === "pending");
        const orders = allOrders.filter((o) => o.status === "paid");

        res.json({ preOrders, orders });
    } catch (error) {
        console.error("Erreur récupération commandes :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
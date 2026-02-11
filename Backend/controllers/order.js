//Controllers/order.js
const Order = require("../Model/Order");
const Product = require("../Model/product");
const Cart = require("../Model/Cart");
const mongoose = require("mongoose");
const { sendEmail } = require("../utils/mailer");


exports.createOrder = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const { items, totalPrice, delivery } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Aucun article dans la commande" });
        }

        const enrichedItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error(`Produit introuvable : ${item.productId}`);

                const optSize = item.options?.size;
                const optUnit = item.options?.unit || "ml";
                if (!optSize) throw new Error(`Options manquantes pour le produit : ${product.nom}`);

                const selectedOption = product.options.find(
                    (opt) =>
                        Number(opt.size) === Number(optSize) &&
                        opt.unit.toLowerCase() === optUnit.toLowerCase()
                );
                if (!selectedOption) throw new Error(`Option invalide pour le produit : ${product.nom}`);

                const variantId = selectedOption._id; // ObjectId
                return {
                    productId: product._id,
                    variantId, // ObjectId
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
            totalPrice: Number(totalPrice),
            status: "pending",          // Enum valide
            paymentStatus: "unpaid",   // Enum valide
            delivery,
            createdAt: new Date(),
        });

        await order.save();

        return res.status(201).json({
            message: "Commande créée avec succès",
            order,
        });

    } catch (error) {
        console.error("❌ Erreur création commande:", error.message);
        return res.status(500).json({ error: error.message });
    }
};
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Commande introuvable" });

        if (order.userId.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Accès interdit" });
        }

        const updateData = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            updateData,
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        if (updatedOrder.userId.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Accès interdit" });
        }

        return res.status(200).json({ message: "Commande mise à jour", order: updatedOrder });
    } catch (error) {
        console.error("Erreur mise à jour commande:", error.message);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.finalizeOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        order.status = "confirmed";
        order.paymentStatus = "paid";
        order.paidAt = new Date();
        await order.save();

        return res.status(200).json({ message: "Commande finalisée", order });
    } catch (error) {
        console.error("Erreur finalisation commande:", error.message);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getMyOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const allOrders = await Order.find({ userId: req.user.userId })
            .sort({ createdAt: -1 });

        const preOrders = allOrders.filter(
            o => o.status === "pending" && o.paymentStatus === "unpaid"
        );

        const orders = allOrders.filter(
            o => o.status === "confirmed" && o.paymentStatus === "paid"
        );

        const cancelledOrders = allOrders.filter(
            o => o.status === "cancelled"
        );

        const refundedOrders = allOrders.filter(
            o => o.status === "refunded"
        );

        return res.status(200).json({
            preOrders,
            orders,
            cancelledOrders,
            refundedOrders
        });

    } catch (error) {
        console.error("Erreur récupération commandes:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        // Vérification des rôles
        const isOwner = order.userId.toString() === req.user.userId;
        const isAdmin = req.user.role === "admin";
        const isSeller = req.user.role === "vendeur";

        // Client → doit être propriétaire
        if (req.user.role === "client" && !isOwner) {
            return res.status(403).json({ message: "Accès interdit" });
        }

        // Vendeur → peut supprimer seulement si tu le décides
        if (isSeller && !isAdmin) {
            // Ici tu peux ajouter une logique : vérifier si le vendeur est lié au produit
            // Exemple :
            // const product = await Product.findById(order.items[0].productId);
            // if (product.sellerId.toString() !== req.user.userId) return res.status(403).json({ message: "Accès interdit" });
        }

        // Admin → accès total
        await order.deleteOne();

        return res.status(200).json({ message: "Commande supprimée" });
    } catch (error) {
        console.error("Erreur suppression commande:", error.message);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "email nom prenom pays");
        return res.status(200).json(orders);
    } catch (error) {
        console.error("Erreur récupération commandes:", error.message);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
        }

        const allOrders = await Order.find({ userId }).sort({ createdAt: -1 });

        // 🔴 Pré-commandes
        const preOrders = allOrders.filter(
            o => o.status === "pending" && o.paymentStatus === "unpaid"
        );

        // 🟢 Commandes payées
        const orders = allOrders.filter(
            o => o.status === "confirmed" && o.paymentStatus === "paid"
        );

        // ⚫ Commandes annulées
        const cancelledOrders = allOrders.filter(
            o => o.status === "cancelled"
        );

        return res.status(200).json({ preOrders, orders, cancelledOrders });

    } catch (error) {
        console.error("Erreur récupération commandes:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "ID commande invalide" });
        }
        //  const order = await Order.findById(orderId);
        const order = await Order.findById(orderId).populate("userId", "nom prenom email").populate("items.productId");

        if (!order) {
            return res.status(404).json({ message: "Commande introuvable" });
        }
        return res.status(200).json(order);

    } catch (error) {
        console.error("Erreur récupération commande:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.shipOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const order = await Order.findById(orderId).populate("userId");
        if (!order) {
            return res.status(404).json({ message: "Commande introuvable" });
        }
        order.status = "shipped";
        order.shippedAt = new Date();
        await order.save();

        // ⭐ Email d’expédition
        const html = `
      <h2>Votre commande est expédiée 🚚</h2>
      <p>Bonjour ${order.userId.prenom},</p>

      <p>Votre commande <strong>${order._id}</strong> vient d'être expédiée.</p>

      <p>Vous pourrez suivre votre colis ici :</p>
      <a href="https://www.mondialrelay.com"
         style="background:#4c6ef5;color:white;padding:10px 15px;text-decoration:none;border-radius:8px;">
         Suivre mon colis
      </a>

      <br><br>
      <p>Merci pour votre confiance 💐</p>
    `;

        await sendEmail({
            to: order.userId.email,
            subject: "Votre commande est expédiée",
            html,
            text: "Votre commande est expédiée.",
        });

        res.json({ success: true, message: "Commande expédiée", order });

    } catch (err) {
        console.error("Erreur shipOrder :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.deliverOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        // Vérification correcte de l'utilisateur
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Accès interdit" });
        }

        order.status = "delivered";
        order.deliveryStatus = "delivered";
        order.deliveredAt = new Date();

        await order.save();

        res.json({ message: "Commande marquée comme reçue", order });
    } catch (error) {
        console.error("Erreur livraison commande :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Commande introuvable" });

        // Vérifier que l'utilisateur est propriétaire
        if (order.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Accès interdit" });
        }

        // Vérifier que la commande n'est pas déjà expédiée
        const nonCancellableDelivery = ["shipped", "in_transit", "out_for_delivery", "delivered"];
        if (nonCancellableDelivery.includes(order.delivery)) {
            return res.status(400).json({ message: "Commande non annulable" });
        }

        // Restaurer les articles dans le panier
        let cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) cart = new Cart({ userId: req.user.userId, items: [] });

        order.items.forEach(item => cart.items.push(item));
        await cart.save();

        // Annuler la commande
        order.status = "cancelled";
        await order.save();

        return res.json({ message: "Commande annulée et panier restauré", order });
    } catch (err) {
        console.error("Erreur annulation commande :", err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

// ➤ Récupérer toutes les commandes pour admin / vendeur
exports.getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "nom email") // infos client
            .populate("products.product", "nom prix"); // infos produits

        // Calcul du chiffre d'affaires total
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + order.products.reduce((s, p) => s + p.quantity * p.product.prix, 0);
        }, 0);

        res.json({
            totalRevenue,
            totalOrders: orders.length,
            orders
        });
    } catch (err) {
        console.error("Erreur récupération commandes admin :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.refundOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        if (order.paymentStatus !== "paid") {
            return res.status(400).json({ message: "Impossible de rembourser une commande non payée" });
        }

        order.status = "refunded";
        order.paymentStatus = "refunded";
        order.refundedAt = new Date();

        await order.save();

        return res.status(200).json({ message: "Commande remboursée", order });

    } catch (error) {
        console.error("Erreur remboursement :", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};


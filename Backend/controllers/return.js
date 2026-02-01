//controllers/return.js
const ReturnRequest = require("../Model/ReturnRequest.js");
const Order = require("../Model/Order.js");



exports.createReturnRequest = async (req, res) => {
    try {
        const { orderId, productId, reason, description } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Commande introuvable" });

        const alreadyRequested = await ReturnRequest.findOne({
            user: req.user._id,
            order: orderId,
            product: productId,
        });

        if (alreadyRequested) {
            return res.status(400).json({ message: "Retour déjà demandé pour ce produit" });
        }

        const request = await ReturnRequest.create({
            user: req.user._id,
            order: orderId,
            product: productId,
            reason,
            description,
        });

        res.json({ success: true, request });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

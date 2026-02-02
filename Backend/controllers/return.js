//controllers/return.js
const ReturnRequest = require("../Model/ReturnRequest.js");
const Order = require("../Model/Order.js");

exports.createReturnRequest = async (req, res) => {
    try {
        const { orderId, productId, reason, description } = req.body;

        // Vérifier que la commande existe
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        // Vérifier si un retour existe déjà
        const alreadyRequested = await ReturnRequest.findOne({
            userId: req.user.userId,
            orderId: orderId,
            productId: productId,
        });

        if (alreadyRequested) {
            return res.status(400).json({ message: "Retour déjà demandé pour ce produit" });
        }

        // Créer la demande de retour
        const request = await ReturnRequest.create({
            userId: req.user.userId,
            orderId,
            productId,
            reason,
            description,
        });

        res.json({ success: true, request });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


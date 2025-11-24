
const Order = require("../Model/Order");

exports.create = async (req, res) => {
    try {
        const { items, totalPrice, addresses } = req.body;

        const order = new Order({
            userId: req.user.userId,   // ← FIX
            items,
            totalPrice,
            addresses
        });

        await order.save();

        res.status(201).json({ message: "Commande créée", order });
    } catch (error) {
        console.error("Erreur création commande :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email"); // optionnel: populate user info
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
    }
};


/*model Order*/
/*
const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
        },
    ],
    totalPrice: Number,
    address: String,
    status: { type: String, default: "pending" }, // pending, confirmed, shipped, delivered
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);

*/
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String,          // nom du produit
            prix: Number,          // prix du produit
            imageUrl: String,      // chemin de l'image (ex: "uploads/products/dior.jpg")
            quantity: Number,      // quantité commandée
        },
    ],
    totalPrice: Number,
    address: String,
    status: { type: String, default: "pending, confirmed, shipped, delivered" }, // pending, confirmed, shipped, delivered
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);









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
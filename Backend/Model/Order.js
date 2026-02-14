// models/Order.js
const mongoose = require("mongoose");


const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" }, nom: String, quantite: Number, imageUrl: String, // ⭐ statut de retour par produit
    returnStatus: { type: String, enum: ["none", "requested", "approved", "returned", "refunded"], default: "none" }
});

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
                nom: { type: String, required: true },
                quantite: { type: Number, required: true },
                imageUrl: String,
                options: {
                    size: { type: Number, required: true },
                    unit: { type: String, default: "ml" },
                    prix: { type: Number, required: true },
                },
            },
        ],

        totalPrice: { type: Number, required: true },
        status: {
            type: String,
            enum: [
                "pending",          // commande créée mais pas encore payée
                "confirmed",        // paiement effectué, pas encore expédiée
                "shipped",          // expédiée
                "delivered",        // livrée
                "return_requested", // client demande un retour
                "returned",         // produit retourné au vendeur
                "cancelled",        // annulée
                "refunded"          // remboursée
            ],
            default: "pending",
        },

        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "failed", "refunded"],
            default: "unpaid",
        },

        stripeSessionId: String,
        delivery: {
            type: String,
            enum: ["processing", "shipped", "in_transit", "out_for_delivery", "delivered"],
            default: "processing",
        },

        invoiceUrl: { type: String },

        paidAt: Date,
        shippedAt: Date,
        deliveredAt: Date,
        refundedAt: Date,
        cancelledAt: Date,

    },
    { timestamps: true }
);

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
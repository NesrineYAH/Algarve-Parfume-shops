const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            nom: { type: String, required: true },          // nom du produit
            quantity: { type: Number, required: true },     // nombre d’articles commandés
            imageUrl: String,
            option: {                                       // l’option choisie (quantité / prix)
                quantity: { type: String, required: true },  // ex: "10ml", "30ml"
                prix: { type: Number, required: true },      // prix correspondant à cette option
                stock: { type: Number, default: 0 }        // stock spécifique à cette option
            },
        },
    ],
    totalPrice: { type: Number, required: true },       // total de la commande
    //  address: { type: String },                          // adresse de livraison
    status: { type: String, default: "pending" },      // pending, confirmed, shipped, delivered
    createdAt: { type: Date, default: Date.now },
    delivery: {
        type: String, // "domicile", "magasin", "pointRelais"
        address: String,
        relayId: String,
    },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
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
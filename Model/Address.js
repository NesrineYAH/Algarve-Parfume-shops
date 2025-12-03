const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Lien vers l'utilisateur
    street: { type: String, required: true },       // anciennement 'rue'
    city: { type: String, required: true },         // anciennement 'ville'
    postalCode: { type: String, required: true },  // anciennement 'codePostal'
    country: { type: String, required: true },     // anciennement 'pays'
    type: { type: String, enum: ["shipping", "billing"], default: "shipping" }, // anciennement 'livraison'/'facturation'
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Address", addressSchema);

const mongoose = require("mongoose");

// Schéma des produits
const productSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  stock: { type: Number, default: 0 },
  categorie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categorie",
  },
  options: [
    {
      quantity: { type: String, required: true }, // ex: "10ml", "30ml"
      prix: { type: Number, required: true },   // ex: 5, 10
      stock: { type: Number, default: 0 }        // stock spécifique à cette option
    }
  ],
});

module.exports = mongoose.model("Product", productSchema);










/*
// Schéma des produits
const productSchema = new mongoose.Schema({
  nom: String,
  prix: Number,
  description: String,
  imageUrl: String,
  stock: Number,
  categorie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categorie", // Assure-toi que ce modèle existe
  },
});

module.exports = mongoose.model("Product", productSchema);
*/
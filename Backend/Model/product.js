const mongoose = require("mongoose");

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

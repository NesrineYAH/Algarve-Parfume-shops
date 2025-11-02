const mongoose = require("mongoose");

// Schéma des produits
const productSchema = new mongoose.Schema({
  nom: String,
  prix: Number,
  description: String,
  imageUrl: String,
});
module.exports = mongoose.model("Product", productSchema);

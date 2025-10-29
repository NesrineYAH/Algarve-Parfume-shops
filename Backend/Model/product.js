const mongoose = require("mongoose");

// Schéma des produits
const productSchema = new mongoose.Schema({
  nom: String,
  prix: Number,
  description: String,
  image: String,
});
module.exports = mongoose.model("Product", productSchema);

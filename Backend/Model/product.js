// Model Product - Schéma des produits
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    description: { type: String },
    imageUrl: String,
    stock: { type: Number, default: 0 },
    categorie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie",
    },
    options: [
      {
        size: { type: Number, required: true },
        unit: { type: String, default: "ml" },
        prix: { type: Number, required: true },
        stock: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true, // ✅ ICI
  }
);

module.exports = mongoose.model("Product", productSchema);

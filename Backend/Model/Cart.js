const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      nom: { type: String, required: true },        // cohérent avec Order
      imageUrl: String,
      quantity: { type: Number, default: 1 },       // nombre d’articles choisis
      option: {                                     // option choisie (comme dans Order)
        quantity: { type: String, required: true }, // ex: "10ml", "30ml"
        prix: { type: Number, required: true },     // prix correspondant
      },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);






/*
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      nom: String,
      prix: Number,
      imageUrl: String,
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
*/
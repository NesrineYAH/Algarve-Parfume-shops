//Model/User.js 
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // 🧍 Identité
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
  },

  // 📧 Authentification
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },

  // 🎭 Rôle
  role: {
    type: String,
    enum: ["admin", "client", "vendeur"], // ✅ Ajouté vendeur
    default: "client",
  },

  // 📅 Métadonnées
  date_creation: {
    type: Date,
    default: Date.now,
  },

  // ✅ Vérification email
  confirmationCode: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  // ❤️ Favoris
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  // 🔑 Reset mot de passe
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },

  // 💳 Paiement (Stripe)
  stripeCustomerId: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);


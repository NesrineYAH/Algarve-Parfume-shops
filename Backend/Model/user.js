//Model/User.js 
// Model/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // 🧍 Identité
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },

  // 📧 Auth
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },

  // 📞 Téléphone (NOUVEAU)
  phone: {
    type: String,
    default: "",
  },

  // 🎭 Rôle
  role: {
    type: String,
    enum: ["admin", "client", "vendeur"],
    default: "client",
  },

  date_creation: { type: Date, default: Date.now },

  // ✅ Vérification email
  confirmationCode: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },

  // ❤️ Favoris
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  // 🔑 Reset mdp
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // 💳 Stripe
  stripeCustomerId: { type: String, default: null },

  // ⚙️ Préférences de communication
  preferences: {
    newsletter: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    phoneContact: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model("User", userSchema);











/*
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

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
    enum: ["admin", "client", "vendeur"], 
  },

  // 📅 Métadonnées
  date_creation: {
    type: Date,
    default: Date.now,
  },


  confirmationCode: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },

  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],


  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },


  stripeCustomerId: {
    type: String,
    default: null,
  },
  preferences: {
    newsletter: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    phoneContact: { type: Boolean, default: false }
  }

});
module.exports = mongoose.model("User", userSchema);
*/

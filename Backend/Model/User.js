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


  phone: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["admin", "client", "vendeur"],
    default: "client",
  },
  date_creation: { type: Date, default: Date.now },
  confirmationCode: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  stripeCustomerId: { type: String, default: null },


  preferences: {
    newsletter: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    phoneContact: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model("User", userSchema);











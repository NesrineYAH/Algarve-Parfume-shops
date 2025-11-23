const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },       // 🔹 anciennement 'name'
  prenom: { type: String, required: true },    // 🔹 nouveau champ
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔹 renommer
  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client",
  },
  date_creation: { type: Date, default: Date.now },
  confirmationCode: { type: String, unique: true },
  status: { type: String, enum: ["Pending", "Active"], default: "Pending" },
});
module.exports = mongoose.model("User", userSchema);

//  nom: { type: String, required: true },       // 🔹 anciennement 'name'
//  prenom: { type: String, required: true },    // 🔹 nouveau champ
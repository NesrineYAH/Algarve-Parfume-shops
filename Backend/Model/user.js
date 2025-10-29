const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔹 renommer
  role: { type: String, default: "client" },
  date_creation: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", userSchema);

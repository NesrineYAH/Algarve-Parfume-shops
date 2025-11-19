const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔹 renommer
  role: { type: String, default: "client" },
  date_creation: { type: Date, default: Date.now },
  confirmationCode: { type: String, unique: true },
  status: { type: String, enum: ["Pending", "Active"], default: "Pending" },
});
module.exports = mongoose.model("User", userSchema);

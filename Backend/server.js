// Backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./mongoDB/DB"); // Connexion MongoDB
require("./routes/RoutesUsers");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// 🔹 Import des routes
const productRoutes = require("./routes/products");
userRoutes = require("./routes/RoutesUsers");
// 🔹 Utilisation des routes
app.use("/data/products", productRoutes);
app.use("/data/users", userRoutes);

// 🔹 Route de test
app.get("/", (req, res) => {
  res.send("🚀 Backend Parfum API en marche !");
});

// 🔹 Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});

module.exports = app;

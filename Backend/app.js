const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");

require("./mongoDB/DB"); // Connexion MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json()); // <-- avant les routes
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/pictures", express.static(path.join(__dirname, "pictures")));

// Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend Parfum API en marche !");
});

// 🔹 Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});

module.exports = app;

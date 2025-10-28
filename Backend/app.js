const express = require("express");
const path = require("path");
const cors = require("cors");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");

require("./mongoDB/DB"); // Connexion MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Backend Parfum API en marche !");
});

app.use("/api/users", userRoutes);

// 🔹 Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});

module.exports = app;

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/pictures", express.static(path.join(__dirname, "pictures")));

module.exports = app;

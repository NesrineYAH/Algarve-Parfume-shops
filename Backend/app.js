const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const ProductRoutes = require("./routes/product");
const categorieRoutes = require("./routes/categories");
const cartRoutes = require("./routes/cart");

require("./mongoDB/DB");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/products/:id", ProductRoutes);
app.use("/api/categories", categorieRoutes);
app.use("api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend Parfum API en marche !");
});

// 🔹 Lancement du serveur
app.listen(PORT, () => console.log("Serveur API sur http://localhost:5001"));

module.exports = app;

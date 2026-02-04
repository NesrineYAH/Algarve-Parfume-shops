// Backend/app.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
// Routes
const userRoutes = require("./routes/users");
const ProductRoutes = require("./routes/product");
const categorieRoutes = require("./routes/categories");
const cartRoutes = require("./routes/carts");
const addressRoutes = require("./routes/addresses");
const orderRoutes = require("./routes/orders");
const deliveryRoutes = require("./routes/delivery");
const stripeRoute = require("./routes/stripe");
const contactRoutes = require("./routes/contacts");
const commentsRoutes = require("./routes/comments");
const notificationsRoutes = require("./routes/notifications");
const promotionsRoutes = require("./routes/promotions");
const avisRoutes = require("./routes/avis");
const paymentMethodsRoutes = require("./routes/paymentMethods");
const paymentsRoute = require("./routes/payments");
const favoritesRoutes = require("./routes/favorites");
const { authMiddleware } = require("./middleware/auth");
const stripeWebhook = require("./routes/stripeWebhook");
const cookieParser = require("cookie-parser");
const returnRoutes = require("./routes/return");
require("./mongoDB/DB");

const app = express();
const PORT = process.env.PORT || 5000;

// app.js ⚠️ STRIPE WEBHOOK (RAW BODY) — DOIT ÊTRE AU DÉBUT
app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

// ⚡ Middlewares globaux
app.use(cors({
  origin:
    "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ⚡ Static files
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/etiquettes", express.static(path.join(__dirname, "public/etiquettes")));

// 🚀 Routes publiques
app.use("/api/users", userRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/products", commentsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/avis", avisRoutes);
app.use("/api/returns", returnRoutes);


// ⚡ Routes Stripe & paiement
app.use("/api/stripe", stripeRoute);
app.use("/api/payment", paymentsRoute);

// ⚡ Routes protégées avec authMiddleware
app.use("/api", authMiddleware, paymentMethodsRoutes);
app.use("/api/users/favorites", favoritesRoutes);

// 💡 Page d’accueil
app.get("/", (req, res) => {
  res.send("🚀 Backend Parfum API en marche !");
});

module.exports = app;



//                                       stripe listen --forward-to localhost:5001/api/stripe/webhook

const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const ProductRoutes = require("./routes/product");
const categorieRoutes = require("./routes/categories");
const cartRoutes = require("./routes/carts");
const addressRoutes = require("./routes/addresses");
const orderRoutes = require("./routes/orders");
const deliveryRoutes = require("./routes/delivery");
const paymentRoutes = require("./routes/payments");
const stripeRoute = require("./routes/stripe");
const contactRoutes = require("./routes/contacts");
const commentsRoutes = require("./routes/comments");
const notificationsRoutes = require("./routes/notifications");
const promotionsRoutes = require("./routes/promotions");
const avisRoutes = require("./routes/avis");
const stripeWebhook = require("./routes/stripeWebhook");
const paymentMethodsRoutes = require("./routes/paymentMethods");
const paymentsRoute = require("./routes/payments");
const { authMiddleware } = require("./middleware/auth");
require("./mongoDB/DB");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ⚠️ WEBHOOK AVANT express.json()
app.use(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static(path.join(__dirname, "images")));
// Routes
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
app.use("/api/stripe", stripeRoute);
app.use("/api/payment", paymentRoutes);
app.use("/api", authMiddleware, paymentMethodsRoutes);
app.use("/api", authMiddleware, paymentsRoute);


app.get("/", (req, res) => {
  res.send("🚀 Backend Parfum API en marche !");
});

module.exports = app;




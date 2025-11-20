// routes/cart.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const cartCtrl = require("../controllers/cartController");

/* -----------------------------
   🟢 CREATE (C de CRUD)
-------------------------------- */

// ➤ Ajouter un produit au panier
router.post("/add", auth, cartCtrl.addToCart);

/* -----------------------------
   🔵 READ (R de CRUD)
-------------------------------- */

// ➤ Récupérer le panier du user connecté
router.get("/", auth, cartCtrl.getCart);

/* -----------------------------
   🟡 UPDATE (U de CRUD)
-------------------------------- */

// ➤ Modifier la quantité d’un produit
router.put("/update", auth, cartCtrl.updateQuantity);

/* -----------------------------
   🔴 DELETE (D de CRUD)
-------------------------------- */

// ➤ Supprimer un produit du panier
router.delete("/remove/:productId", auth, cartCtrl.removeItem);

// ➤ Vider totalement le panier
router.delete("/clear", auth, cartCtrl.clearCart);

module.exports = router;

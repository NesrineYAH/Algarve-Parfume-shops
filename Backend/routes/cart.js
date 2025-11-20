// routes/cart.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const cartCtrl = require("../controllers/cart");

router.post("/add", auth, cartCtrl.addToCart);
router.get("/", auth, cartCtrl.getCart);
router.put("/update", auth, cartCtrl.updateQuantity);
router.delete("/remove/:productId", auth, cartCtrl.removeItem);
router.delete("/clear", auth, cartCtrl.clearCart);

module.exports = router;

const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order");
const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, OrderController.create);
router.get("/all", authMiddleware, OrderController.getAllOrders);

module.exports = router;

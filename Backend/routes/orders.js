// Routes/orders.js
const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/auth");
const orderCtrl = require("../controllers/order");

// ➤ CRÉER UNE COMMANDE
router.post("/create", authMiddleware, orderCtrl.createOrder);
// ➤ METTRE À JOUR UNE COMMANDE
router.put("/:orderId", authMiddleware, orderCtrl.updateOrder);
router.post("/finalize/:orderId", authMiddleware, orderCtrl.finalizeOrder);
router.get("/my-orders", authMiddleware, orderCtrl.getMyOrders);
router.delete("/:orderId", authMiddleware, orderCtrl.deleteOrder);

router.get("/user/:userId", authMiddleware, orderCtrl.getOrdersByUserId);
router.get("/all", authMiddleware, isAdmin, orderCtrl.getAllOrders);
router.get("/:orderId", authMiddleware, orderCtrl.getOrderById);
router.put("/:orderId/ship", authMiddleware, isAdmin, orderCtrl.shipOrder);
router.post("/:orderId/deliver", authMiddleware, orderCtrl.deliverOrder);
router.post("/:orderId/cancel", authMiddleware, orderCtrl.cancelOrder);
router.post("/:orderId/refund", authMiddleware, isAdmin, orderCtrl.refundOrder);
router.get("/admin", authMiddleware, isAdmin, orderCtrl.getAllOrdersAdmin);


module.exports = router;







/*
- POST /api/orders/create → createOrder
- PUT /api/orders/:id → updateOrder
- POST /api/orders/finalize/:id → finalizeOrder
- GET /api/orders/my-orders → getMyOrders
- DELETE /api/orders/:id → deleteOrder
- GET /api/orders/all → getAllOrders
- GET /api/orders/user/:userId → getOrdersByUserId

*/

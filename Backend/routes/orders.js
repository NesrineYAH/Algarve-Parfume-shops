// Routes/orders.js
const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/auth");
const orderCtrl = require("../controllers/order");

// ➤ CRÉER UNE COMMANDE
router.post("/create", authMiddleware, orderCtrl.createOrder);

// ➤ METTRE À JOUR UNE COMMANDE
router.put("/:orderId", authMiddleware, orderCtrl.updateOrder);

// ➤ FINALISER UNE COMMANDE
router.post("/finalize/:orderId", authMiddleware, orderCtrl.finalizeOrder);

// ➤ RÉCUPÉRER LES COMMANDES DE L’UTILISATEUR CONNECTÉ
router.get("/my-orders", authMiddleware, orderCtrl.getMyOrders);

// ➤ SUPPRIMER UNE COMMANDE
router.delete("/:orderId", authMiddleware, orderCtrl.deleteOrder);

// ➤ RÉCUPÉRER TOUTES LES COMMANDES (ADMIN)
router.get("/all", authMiddleware, isAdmin, orderCtrl.getAllOrders);

// ➤ RÉCUPÉRER LES COMMANDES D’UN UTILISATEUR PAR ID
router.get("/user/:userId", authMiddleware, orderCtrl.getOrdersByUserId);

// ➤ RÉCUPÉRER UNE COMMANDE PAR ID
router.get("/:orderId", authMiddleware, orderCtrl.getOrderById);

// ➤ EXPÉDIER UNE COMMANDE (ADMIN)
router.post("/:orderId/ship", authMiddleware, isAdmin, orderCtrl.shipOrder);

// ➤ MARQUER COMME REÇUE (CLIENT)
router.post("/:orderId/deliver", authMiddleware, orderCtrl.deliverOrder);

// ➤ ANNULER UNE COMMANDE (CLIENT)
router.post("/:orderId/cancel", authMiddleware, orderCtrl.cancelOrder);
                                                          
// ➤ MARQUER UNE COMMANDE COMME PAYÉE
// router.post("/:orderId/mark-paid", authMiddleware, orderCtrl.markOrderAsPaid);

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

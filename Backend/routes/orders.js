const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/auth");
const orderCtrl = require("../controllers/order");

// ➤ CRÉER UNE COMMANDE
router.post("/create", authMiddleware, orderCtrl.createOrder);

// ➤ METTRE À JOUR UNE COMMANDE
router.put("/:id", authMiddleware, orderCtrl.updateOrder);

// ➤ FINALISER UNE COMMANDE
router.post("/finalize/:id", authMiddleware, orderCtrl.finalizeOrder);

// ➤ RÉCUPÉRER LES COMMANDES DE L’UTILISATEUR CONNECTÉ
router.get("/my-orders", authMiddleware, orderCtrl.getMyOrders);

// ➤ SUPPRIMER UNE COMMANDE
router.delete("/:id", authMiddleware, orderCtrl.deleteOrder);

// ➤ RÉCUPÉRER TOUTES LES COMMANDES (ADMIN)
router.get("/all", authMiddleware, isAdmin, orderCtrl.getAllOrders);

// ➤ RÉCUPÉRER LES COMMANDES D’UN UTILISATEUR PAR SON ID
router.get("/user/:userId", authMiddleware, orderCtrl.getOrdersByUserId);

module.exports = router;


/*
const express = require("express");
const router = express.Router();
const Order = require("../Model/Order");
const Product = require("../Model/product");
const { authMiddleware, isAdmin } = require("../middleware/auth");
const orderCtrl = require("../controllers/order");


router.post("/create", authMiddleware, orderCtrl.createOrder);
router.put("/:id", authMiddleware, orderCtrl.updateOrder);
router.post("/finalize/:id", authMiddleware, orderCtrl.finalizeOrder);
router.get("/my-orders", authMiddleware, orderCtrl.getMyOrders);
router.delete("/:id", authMiddleware, orderCtrl.deleteOrder);
router.get("/all", authMiddleware, isAdmin, orderCtrl.getAllOrders);
router.get("/user/:userId", authMiddleware, orderCtrl.getOrdersByUserId);
module.exports = router;
*/


/*
- POST /api/orders/create → createOrder
- PUT /api/orders/:id → updateOrder
- POST /api/orders/finalize/:id → finalizeOrder
- GET /api/orders/my-orders → getMyOrders
- DELETE /api/orders/:id → deleteOrder
- GET /api/orders/all → getAllOrders
- GET /api/orders/user/:userId → getOrdersByUserId

*/

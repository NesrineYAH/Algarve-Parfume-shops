const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/auth");
const orderCtrl = require("../controllers/order");
const Cart = require("../Model/Cart");


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

// concel orders
router.post("/:orderId/cancel", async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ message: "Commande introuvable" });

  if (order.status !== "pending") {
    return res.status(400).json({ message: "Commande non annulable" });
  }

  // 🔁 Remettre les articles dans le panier
  let cart = await Cart.findOne({ userId: order.user });
  if (!cart) {
    cart = new Cart({ userId: order.user, items: [] });
  }

  order.items.forEach(item => {
    cart.items.push(item);
  });

  await cart.save();

  // ❌ Annuler la commande
  order.status = "cancelled";
  await order.save();

  res.json({ message: "Commande annulée, panier restauré" });
});


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

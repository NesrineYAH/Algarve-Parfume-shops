//Routes/orders.js
const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/auth");
const orderCtrl = require("../controllers/order");
const Cart = require("../Model/Cart");
const Order = require("../Model/Order");

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
router.get("/:id", orderCtrl.getOrderById);

// ➤ EXPÉDIER UNE COMMANDE (ADMIN)
router.post("/:id/ship", authMiddleware, isAdmin, orderCtrl.shipOrder);

// ➤ MARQUER COMME REÇUE (CLIENT)
router.post("/:id/deliver", authMiddleware, orderCtrl.deliverOrder);

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

// GET /api/orders/:orderId
router.get("/:orderId", authMiddleware, async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  res.json(order);
});
//routes backend temporaire pour marquer une commande comme payée
// routes/orders.js 
router.post("/:orderId/mark-paid", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Commande introuvable" });

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Commande déjà payée" });
    }

    order.paymentStatus = "paid";
    order.status = "paid";
    order.paidAt = new Date();
    await order.save();

    res.json({ message: "Commande mise à jour avec succès", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
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

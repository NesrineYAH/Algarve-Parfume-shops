const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const { authMiddleware, isAdmin } = require("../middleware/auth");

// ➤ REGISTER & LOGIN
router.post("/register", userCtrl.validate("register"), userCtrl.register);
router.post("/login", userCtrl.login);

// ➤ Mon compte
router.get("/moncompte", authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

// ➤ Récupérer les commandes d’un utilisateur par ID
router.get("/user/:id", authMiddleware, userCtrl.getUserOrders);

// ➤ Récupérer tous les utilisateurs (admin seulement)
router.get("/all", authMiddleware, isAdmin, userCtrl.getUsers);

module.exports = router;

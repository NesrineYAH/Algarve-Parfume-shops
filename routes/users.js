const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const { authMiddleware } = require("../middleware/auth");


router.post("/register", userCtrl.validate("register"), userCtrl.register);
router.post("/login", userCtrl.login);


router.get("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Vérifie que l'ID est bien un ObjectId valide
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
        }

        const orders = await Order.find({ userId: id });
        res.json(orders);
    } catch (err) {
        console.error("Erreur récupération commandes :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get("/moncompte", authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;

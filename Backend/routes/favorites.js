const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const { authMiddleware } = require("../middleware/auth");

// 🔹 GET favoris
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate("favorites");

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.json(user.favorites);
    } catch (error) {
        console.error("❌ Erreur récupération favoris :", error);
        res.status(500).json({ message: "Erreur serveur favoris" });
    }
});

// 🔹 TOGGLE favori
router.post("/:productId", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const index = user.favorites.findIndex(
            (fav) => fav.toString() === productId
        );

        if (index === -1) {
            user.favorites.push(productId);
        } else {
            user.favorites.splice(index, 1);
        }

        await user.save();
        await user.populate("favorites");

        res.json(user.favorites);
    } catch (error) {
        console.error("❌ Erreur toggle favori :", error);
        res.status(500).json({ message: "Erreur serveur favoris" });
    }
});

// 🔹 MERGE favoris (optionnel)
router.put("/merge", authMiddleware, async (req, res) => {
    try {
        const { favorites } = req.body;
        const user = await User.findById(req.user.userId);

        const merged = [
            ...new Set([...user.favorites.map(f => f.toString()), ...favorites])
        ];

        user.favorites = merged;
        await user.save();
        await user.populate("favorites");

        res.json(user.favorites);
    } catch (error) {
        console.error("❌ Erreur merge favoris :", error);
        res.status(500).json({ message: "Erreur serveur favoris" });
    }
});

module.exports = router;




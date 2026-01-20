const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const { authMiddleware } = require("../middleware/auth");


router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate("favorites");

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.json(user.favorites);
    } catch (error) {
        console.error("❌ Erreur récupération favoris :", error);
        res.status(500).json({ message: "Erreur serveur favoris" });
    }
});


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
            // ➕ Ajouter
            user.favorites.push(productId);
        } else {
            // ➖ Supprimer
            user.favorites.splice(index, 1);
        }

        await user.save();

        // Retourner les favoris mis à jour
        const updatedUser = await User.findById(req.user.userId)
            .populate("favorites");

        res.json(updatedUser.favorites);
    } catch (error) {
        console.error("❌ Erreur toggle favori :", error);
        res.status(500).json({ message: "Erreur serveur favoris" });
    }
});


router.delete("/:productId", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        user.favorites = user.favorites.filter(
            (fav) => fav.toString() !== productId
        );

        await user.save();

        const updatedUser = await User.findById(req.user.userId)
            .populate("favorites");

        res.json(updatedUser.favorites);
    } catch (error) {
        console.error("❌ Erreur suppression favori :", error);
        res.status(500).json({ message: "Erreur serveur favoris" });
    }
});

// PUT /api/users/favorites/merge
router.put("/favorites/merge", authMiddleware, async (req, res) => {
    try {
        const { favorites } = req.body; // tableau d'IDs de produits
        const user = await User.findById(req.user.id);

        // Fusion sans doublons
        const merged = [...new Set([...user.favorites.map(f => f.toString()), ...favorites])];
        user.favorites = merged;
        await user.save();

        res.status(200).json({ favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;

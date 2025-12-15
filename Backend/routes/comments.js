const express = require("express");
const router = express.Router();
const Comment = require("../Model/Comment");

// ✅ Route pour récupérer les commentaires d’un produit
router.get("/products/:id/comments", async (req, res) => {
    try {
        const productId = req.params.id;

        const comments = await Comment.find({ productId })
            .populate("userId", "username email") // récupère infos utilisateur
            .sort({ createdAt: -1 }); // tri par date

        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
    }
});

module.exports = router;

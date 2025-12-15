const express = require("express");
const router = express.Router();
const Comment = require("../Model/Comment");
const Product = require("../Model/product");


// ✅ Récupérer les commentaires d’un produit
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

// ✅ Ajouter un commentaire à un produit
router.post("/products/:id/comments", async (req, res) => {
    try {
        const { rating, text } = req.body;
        const userId = req.user?._id || req.body.userId; // selon ton système d'auth
        /*
                if (!rating || !text) {
                    return res.status(400).json({ error: "Rating et texte sont requis" });
                }
        */

        if (rating === undefined || rating === null || text.trim() === "") {
            return res.status(400).json({ error: "Rating et texte sont requis" });
        }

        const ratingNumber = Number(rating);

        if (Number.isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
            return res.status(400).json({ error: "Rating invalide" });
        }
        if (!userId) {
            return res.status(400).json({ error: "userId manquant" });
        }
        const productId = req.params.id;

        // Créer le commentaire
        const comment = new Comment({
            productId,
            userId,
            rating,
            text,
        });

        await comment.save();

        // 🔹 Recalculer la moyenne des notes du produit
        const comments = await Comment.find({ productId });
        const avgRating = comments.reduce((acc, c) => acc + c.rating, 0) / comments.length;

        await Product.findByIdAndUpdate(productId, { rating: avgRating });

        res.status(201).json({ message: "Commentaire ajouté", comment });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
    }
});

module.exports = router;


/*
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
*/
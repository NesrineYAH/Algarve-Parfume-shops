const express = require("express");
const router = express.Router();
const Comment = require("../Model/Comment");
const Product = require("../Model/product");
const { authMiddleware } = require("../middleware/auth");


router.get("/:id/comments", async (req, res) => {
    try {
        const productId = req.params.id;

        const comments = await Comment.find({ productId })
            .populate("userId", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erreur lors de la récupération des commentaires",
        });
    }
});

// ✅ Ajouter un commentaire à un produit POST /api/products/:id/comments
router.post("/:id/comments", authMiddleware, async (req, res) => {

    try {
        const { rating, text } = req.body;
        const userId = req.user?._id || req.user?.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ error: "Utilisateur non authentifié" });
        }

        if (!text || text.trim() === "" || rating === undefined) {
            return res
                .status(400)
                .json({ error: "Rating et texte sont requis" });
        }

        const ratingNumber = Number(rating);
        if (
            Number.isNaN(ratingNumber) ||
            ratingNumber < 1 ||
            ratingNumber > 5
        ) {
            return res.status(400).json({ error: "Rating invalide" });
        }

        const productId = req.params.id;

        const comment = new Comment({
            productId,
            userId,
            rating: ratingNumber,
            text: text.trim(),
        });

        await comment.save();

        // 🔄 Recalcul de la note moyenne
        const comments = await Comment.find({ productId });
        const avgRating =
            comments.reduce((acc, c) => acc + c.rating, 0) /
            comments.length;

        await Product.findByIdAndUpdate(productId, {
            rating: avgRating,
        });

        res.status(201).json({
            message: "Commentaire ajouté",
            comment,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erreur lors de l'ajout du commentaire",
        });
    }
});

module.exports = router;

/*
const stats = await Comment.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } }
]);

const avgRating = stats[0]?.avgRating || 0;

*/













/*
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

router.post("/:id/comment", authMiddleware, async (req, res) => {
    try {
        const { rating, text } = req.body;
        const userId = req.user?._id || req.user?.userId;
        console.log("AUTH TYPE:", typeof authMiddleware);

        if (!userId) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        if (!text || text.trim() === "" || rating === undefined) {
            return res.status(400).json({ error: "Rating et texte sont requis" });
        }

        const ratingNumber = Number(rating);
        if (Number.isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
            return res.status(400).json({ error: "Rating invalide" });
        }

        const productId = req.params.id;

        const comment = new Comment({
            productId,
            userId,
            rating: ratingNumber,
            text: text.trim(),
        });
        await comment.save();

        const comments = await Comment.find({ productId });
        const avgRating =
            comments.reduce((acc, c) => acc + c.rating, 0) / comments.length;

        await Product.findByIdAndUpdate(productId, { rating: avgRating });

        res.status(201).json({ message: "Commentaire ajouté", comment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
    }
});


module.exports = router;
*/

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
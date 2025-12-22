const express = require("express");
const router = express.Router();
const Avis = require("../Model/Avis");
const { authMiddleware } = require("../middleware/auth");


router.get("/", async (req, res) => {
    try {
        const avis = await Avis.find()
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(avis);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});


router.post("/", authMiddleware, async (req, res) => {
    try {
        const { rating, text } = req.body;
        const userId = req.user.id;

        if (!rating || !text) {
            return res.status(400).json({
                message: "Note et commentaire obligatoires",
            });
        }

        const avis = new Avis({
            userId,
            rating,
            text,
            verifiedPurchase: true, // à améliorer plus tard
        });

        const savedAvis = await avis.save();
        res.status(201).json(savedAvis);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;

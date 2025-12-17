const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const User = require("../models/User");
const authAdmin = require("../middleware/authAdmin");

// POST /api/promotions
router.post("/", authAdmin, async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({ error: "Titre et message requis" });
        }

        const users = await User.find({}, "_id");

        const notifications = users.map((user) => ({
            userId: user._id,
            title,
            message,
            type: "promo",
        }));

        await Notification.insertMany(notifications);

        res.status(201).json({ message: "Promotion envoyée à tous les utilisateurs" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur création promotion" });
    }
});

module.exports = router;

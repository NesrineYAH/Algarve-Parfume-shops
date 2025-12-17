const express = require("express");
const router = express.Router();
const Notification = require("../Model/Notification");
const User = require("../Model/User");
const { authMiddleware, isAdmin } = require("../middleware/auth");
const uploads = require("../middleware/multer-config");

// POST /api/promotions
router.post(
    "/",
    authMiddleware,
    isAdmin,
    uploads.single("image"), // 🔥 ICI
    async (req, res) => {
        try {
            const { title, message, discount, newPrice } = req.body;

            if (!title || !message) {
                return res.status(400).json({ error: "Titre et message requis" });
            }

            const imageUrl = req.file
                ? `/uploads/${req.file.filename}`
                : null;

            const users = await User.find({}, "_id");

            const notifications = users.map((user) => ({
                userId: user._id,
                title,
                message,
                type: "promo",
                discount,
                newPrice,
                imageUrl,
            }));

            await Notification.insertMany(notifications);

            res.status(201).json({ message: "Promotion envoyée à tous les utilisateurs" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur création promotion" });
        }
    }
);

module.exports = router;




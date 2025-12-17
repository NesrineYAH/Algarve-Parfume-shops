const express = require("express");
const router = express.Router();
const Notification = require("../Model/Notification");
const User = require("../Model/User");
const { authMiddleware } = require("../middleware/auth");

// 🔔 Récupérer notifications utilisateur
router.get("/", authMiddleware, async (req, res) => {
    const notifications = await Notification.find({ userId: req.user.userId })
        .sort({ createdAt: -1 });

    res.json(notifications);
});


// ✅ Marquer comme lue
router.put("/:id/read", authMiddleware, async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification lue" });
});
router.post("/promo", authAdmin, async (req, res) => {
    const { title, message } = req.body;

    // Tous les utilisateurs
    const users = await User.find({}, "_id");

    const notifications = users.map(user => ({
        userId: user._id,
        title,
        message,
        type: "promo",
    }));

    await Notification.insertMany(notifications);

    res.json({ message: "Notifications promo envoyées" });
});

module.exports = router;

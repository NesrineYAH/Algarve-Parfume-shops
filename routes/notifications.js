const express = require("express");
const router = express.Router();
const Notification = require("../Model/Notification");
const authMiddleware = require("../middleware/auth");

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

module.exports = router;

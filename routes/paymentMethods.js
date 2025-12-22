// routes/paymentMethods.js
const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const { authMiddleware } = require("../middleware/auth");
const User = require("../Model/User");

router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.stripeCustomerId) {
            return res.json([]);
        }

        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeCustomerId,
            type: "card",
        });

        res.json(paymentMethods.data);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;

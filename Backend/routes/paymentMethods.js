// backend/routes/paymentMethods.js
const express = require("express");
const Payment = require("../Model/Payment");
const router = express.Router();

router.get("/payment-methods", async (req, res) => {
  try {
    const userId = req.user.userId;

    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 });

    const cards = payments.map((p) => ({
      id: p._id,
      brand: p.paymentMethod.brand,
      last4: p.paymentMethod.last4,
      exp_month: p.paymentMethod.exp_month,
      exp_year: p.paymentMethod.exp_year,
      createdAt: p.createdAt,
    }));


    res.json(cards);
  } catch (err) {
    console.error("❌ Payment methods error :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;




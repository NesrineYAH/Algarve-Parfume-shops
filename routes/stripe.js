const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();


const router = express.Router();

// Ta clé secrète Stripe (NE JAMAIS mettre dans le frontend)
const stripe = new Stripe("process.env.sdk_test");

router.post("/create-checkout-session", async (req, res) => {
    try {
        const { cart } = req.body;

        const line_items = cart.map((item) => ({
            price_data: {
                currency: "eur",
                product_data: { name: item.nom },
                unit_amount: Math.round(item.options.prix * 100),
            },
            quantity: item.quantite,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        });

        res.json({ id: session.id });
    } catch (err) {
        console.error("Erreur Stripe :", err);
        res.status(500).json({ error: "Erreur Stripe" });
    }
});

module.exports = router;

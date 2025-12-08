// backend/routes/payment.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")


router.post("/create-checkout-session", async (req, res) => {
    try {
        const { cart } = req.body;

        // Calcul du total côté serveur
        const total = cart.reduce(
            (sum, item) => sum + item.options.prix * item.quantite,
            0
        );

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: { name: "Commande" },
                        unit_amount: total * 100, // en centimes
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",

        });

        res.json({ id: session.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la création du paiement" });
    }
});

module.exports = router;

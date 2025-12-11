const express = require("express");
const router = express.Router();
const Contact = require("../Model/Contact");

router.post("/", async (req, res) => {
    console.log("REQUÊTE :", req.body);
    const { nom, email, message, reason } = req.body;

    if (!nom || !email || !message || !reason) {
        return res.status(400).json({ error: "Champs manquants" });
    }

    // sauvegarde en base
    try {
        const newContact = await Contact.create({
            nom,
            email,
            message,
            reason,
        });

        res.status(200).json({ success: true, data: newContact });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;


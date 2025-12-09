const express = require("express");
const router = express.Router();
const Contact = require("../Model/Contact"); // ton modèle Mongoose

// POST /api/contact
router.post("/", async (req, res) => {
    const { name, email, message, reason } = req.body;

    if (!name || !email || !message || !reason) {
        return res.status(400).json({ error: "Champs manquants" });
    }

    try {
        // Enregistrer dans MongoDB
        const newContact = await Contact.create({
            name,
            email,
            reason,
            message,
        });

        console.log("Message enregistré :", newContact);

        res.status(200).json({ success: true, data: newContact });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Contact = require("../Model/Contact");
const sendEmail = require("../utils/mailer");

router.post("/", async (req, res) => {
    try {
        const { nom, prenom, email, message, reason } = req.body;

        // Vérification des champs obligatoires
        if (!nom || !prenom || !email || !message || !reason) {
            return res.status(400).json({ error: "Champs manquants" });
        }

        // Sauvegarde en base MongoDB
        const newContact = await Contact.create({
            nom,
            prenom,
            email,
            message,
            reason,
        });

        // 📩 Envoi email au user (gestion d'erreur incluse)
        try {
            await sendEmail({
                to: email,
                subject: "📩 Nous avons reçu votre message",
                html: `
          <h2>Bonjour ${prenom},</h2>
          <p>Merci de nous avoir contactés au sujet : <strong>${reason}</strong>.</p>
          <p>Nous avons bien reçu votre message :</p>
          <blockquote>${message}</blockquote>
          <p>Notre équipe vous répondra dans les plus brefs délais.</p>
          <br>
          <p>Cordialement,<br>L’équipe Support</p>
        `,
            });
            console.log(`Email envoyé à ${email}`);
        } catch (mailError) {
            console.error("Erreur lors de l'envoi de l'email :", mailError);
            // On continue quand même, l'enregistrement en DB est réussi
        }

        // Réponse au frontend
        return res.status(200).json({
            success: true,
            message: "Message envoyé et email envoyé au client (si possible).",
            data: newContact,
        });

    } catch (error) {
        console.error("Erreur route contact :", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;

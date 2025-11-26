const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/relays", async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude et longitude requises" });
    }

    try {
        const body = {
            Enseigne: process.env.MR_ENS,        // Ex: 'BDTEST13'
            Pays: "FR",
            Ville: "",
            CP: "",
            Latitude: lat,
            Longitude: lng,
            Taille: "M",
            Poids: 1000,
            Action: "REL", // Points relais
        };

        const response = await axios.post(
            "https://api.mondialrelay.com/Web_Services/WSI4_PointRelais.asmx/RecherchePointRelais",
            body,
            { headers: { "Content-Type": "application/json" } }
        );

        const relays = response.data?.RecherchePointRelaisResult?.PointsRelais?.PointRelais_Details || [];

        res.json({ relays });

    } catch (err) {
        console.error("Erreur API Mondial Relay :", err.message);
        res.status(500).json({ error: "Impossible d’obtenir les points relais" });
    }
});

module.exports = router;

const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const xml2js = require("xml2js");
const router = express.Router();

router.get("/relays", async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude et longitude requises" });
    }

    // ---------- MODE TEST AUTOMATIQUE ----------
    if (!process.env.MR_ENS || !process.env.MR_PRIVATE_KEY) {
        console.warn("⚠️ Mode TEST (identifiants Mondial Relay absents)");
        return res.json({
            relays: [
                {
                    id: "TEST001",
                    name: "Point Relais Test 1",
                    address: "12 Rue du Test",
                    city: "Paris",
                    zip: "75000",
                    lat: parseFloat(lat) + 0.001,
                    lng: parseFloat(lng) + 0.001,
                },
                {
                    id: "TEST002",
                    name: "Point Relais Test 2",
                    address: "5 Avenue Démo",
                    city: "Paris",
                    zip: "75019",
                    lat: parseFloat(lat) - 0.001,
                    lng: parseFloat(lng) - 0.001,
                }
            ]
        });
    }

    try {
        const params = {
            Enseigne: process.env.MR_ENS,
            Pays: "FR",
            Ville: "",
            CP: "",
            Latitude: lat,
            Longitude: lng,
            Taille: "M",
            Poids: "1000",
            Action: "REL"
        };

        const raw =
            params.Enseigne +
            params.Pays +
            params.Ville +
            params.CP +
            params.Latitude +
            params.Longitude +
            params.Taille +
            params.Poids +
            params.Action +
            process.env.MR_PRIVATE_KEY;

        const Security = crypto
            .createHash("sha1")
            .update(raw)
            .digest("hex")
            .toUpperCase();

        const response = await axios.get(
            "https://api.mondialrelay.com/Web_Services.asmx/WSI3_PointRelais_Recherche",
            { params: { ...params, Security } }
        );

        // -------- Vérification XML --------
        xml2js.parseString(response.data, (err, xmlResult) => {
            if (err || !xmlResult) {
                console.warn("⚠️ Réponse Mondial Relay NON XML → mode mock activé");
                return res.json({ relays: [] });
            }

            // Si xmlResult est vide
            if (!xmlResult || typeof xmlResult !== "object") {
                console.warn("⚠️ Réponse MR invalide");
                return res.json({ relays: [] });
            }

            try {
                const envelopeKey = Object.keys(xmlResult)[0];
                const envelope = xmlResult[envelopeKey];
                const bodyKey = Object.keys(envelope)[0];
                const body = envelope[bodyKey][0];
                const respKey = Object.keys(body)[0];
                const respNode = body[respKey][0];
                const resultKey = Object.keys(respNode)[0];
                const resultNode = respNode[resultKey][0];

                const points = resultNode?.PointsRelais?.[0]?.PointRelais_Details;

                if (!Array.isArray(points)) {
                    console.warn("⚠️ Aucun point relais trouvé");
                    return res.json({ relays: [] });
                }

                const relays = points.map((p) => ({
                    id: p.Num?.[0] ?? "",
                    name: p.Libel?.[0] ?? "",
                    address: p.Adresse1?.[0] ?? "",
                    city: p.Ville?.[0] ?? "",
                    zip: p.CP?.[0] ?? "",
                    lat: parseFloat(p.Latitude?.[0] ?? 0),
                    lng: parseFloat(p.Longitude?.[0] ?? 0),
                }));

                return res.json({ relays });

            } catch (e) {
                console.warn("⚠️ Parsing MR impossible, fallback mock");
                return res.json({ relays: [] });
            }
        });

    } catch (e) {
        console.error("Erreur MR:", e.message);
        return res.json({ relays: [] });
    }
});

module.exports = router;

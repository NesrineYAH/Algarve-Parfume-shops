const express = require("express");
const router = express.Router();
const { addAddress, getAddresses, deleteAddress } = require("../controllers/address");
const { authMiddleware, isAdmin } = require("../middleware/auth"); // vérifie que l'utilisateur est connecté

router.post("/", authMiddleware, addAddress);      // ajouter adresse
router.get("/", authMiddleware, getAddresses);     // récupérer adresses
router.delete("/:id", authMiddleware, deleteAddress); // supprimer adresse
router.get("/", authMiddleware, (req, res) => {
    const userAddresses = []; // Ex : À remplacer par DB
    res.json(userAddresses);
});

router.post("/", authMiddleware, (req, res) => {
    const { street, city, postalCode, country, type } = req.body;

    if (!street || !city || !postalCode || !country) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const newAddress = {
        _id: Date.now(),
        street,
        city,
        postalCode,
        country,
        type,
    };

    res.status(201).json({
        message: "Adresse ajoutée avec succès",
        address: newAddress,
    });
});

module.exports = router;

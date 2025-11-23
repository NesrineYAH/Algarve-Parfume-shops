const express = require("express");
const router = express.Router();
const { addAddress, getAddresses, deleteAddress } = require("../controllers/address");
const authMiddleware = require("../middleware/auth"); // vérifie que l'utilisateur est connecté

router.post("/", authMiddleware, isAdmin, addAddress);      // ajouter adresse
router.get("/", authMiddleware, isAdmin, getAddresses);     // récupérer adresses
router.delete("/:id", authMiddleware, isAdmin, deleteAddress); // supprimer adresse

module.exports = router;

const express = require("express");
const router = express.Router();
const { getCategories, createCategorie } = require("../controllers/categorie");

// GET toutes les catégories
router.get("/", getCategories);

// POST créer une catégorie
router.post("/", createCategorie);

module.exports = router;

// controllers/categorieController.js
const Categorie = require("../Model/Categorie");

// Récupérer toutes les catégories
// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Ajouter une catégorie
// POST /api/categories
exports.createCategorie = async (req, res) => {
  try {
    const { nom, description } = req.body;

    const newCategorie = new Categorie({ nom, description });
    await newCategorie.save();

    res.status(201).json({ message: "Catégorie créée", categorie: newCategorie });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

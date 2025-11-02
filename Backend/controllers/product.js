require("dotenv").config();
const Product = require("../Model/product");

// 📦 Contrôleur : Récupérer tous les produits
const getAllProduits = async (req, res) => {
  try {
    const produits = await Product.find();
    res.status(200).json(produits);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ➕ Créer un produit (avec image)
const createProduit = async (req, res) => {
  try {
    // Si tu utilises multer pour l’upload, req.file contiendra l’image
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}` // multer te donne le nom du fichier
      : req.body.imageUrl; // ou bien tu l’envoies directement dans le body JSON

    const produit = await Product.create({
      nom: req.body.nom,
      prix: req.body.prix,
      imageUrl: imageUrl,
    });

    res.status(201).json(produit);
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { getAllProduits, createProduit };

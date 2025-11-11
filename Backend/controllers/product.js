/*
require("dotenv").config();
const Product = require("../Model/product");


const getAllProduits = async (req, res) => {
  try {
    const produits = await Product.find();
    res.status(200).json(produits);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


const createProduit = async (req, res) => {
  try {
    
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}` 
      : req.body.imageUrl; 
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
*/

// routes/product.js
const express = require("express");
const router = express.Router();
const Product = require("../Model/product");

// GET /api/produits - récupérer tous les produits
router.get("/", async (req, res) => {
  try {
    const produits = await Product.find();
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/produits/:id - récupérer un produit par id
router.get("/:id", async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);
    if (!produit)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/produits - ajouter un produit
router.post("/", async (req, res) => {
  const { nom, description, prix, image } = req.body;
  const produit = new Product({ nom, description, prix, image });
  try {
    const nouveauProduit = await produit.save();
    res.status(201).json(nouveauProduit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/produits/:id - supprimer un produit
router.delete("/:id", async (req, res) => {
  try {
    const produit = await Product.findByIdAndDelete(req.params.id);
    if (!produit)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/produits/:id - modifier un produit
router.put("/:id", async (req, res) => {
  try {
    const produit = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!produit)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.json(produit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

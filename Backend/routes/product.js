// routes/product.js
const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config");
const Product = require("../Model/product");
const Categorie = require("../Model/Categorie");
const uploads = require("../middleware/multer-config");

// GET /api/produits - récupérer tous les produits
router.get("/", async (req, res) => {
  try {
    const produits = await Product.find();
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
/*
router.post("/", async (req, res) => {
  const { nom, description, prix, imageUrl } = req.body;
  const produit = new Product({ nom, description, prix, image });
  try {
    const nouveauProduit = await produit.save();
    res.status(201).json(nouveauProduit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
*/
// Route pour ajouter un produit
router.post("/add", async (req, res) => {
  try {
    const newProduct = new Product({
      nom: req.body.nom,
      prix: req.body.prix,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      stock: req.body.stock,
      categorie_id: req.body.categorie_id,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Produit ajouté avec succès", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du produit" });
  }
});

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

const createProduit = async (req, res) => {
  try {
    // req.file vient de Multer
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl; // au cas où on envoie juste un JSON

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

//router.post("/", uploads("image"), createProduit);

router.post("/", uploads, createProduit); // ✅ pas de ("image") ici

module.exports = router;

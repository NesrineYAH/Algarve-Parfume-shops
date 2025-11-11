// routes/product.js
const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config");
const Product = require("../Model/product");
const uploads = require("../middleware/multer-config");

router.post("/add", uploads.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl;

    const newProduct = new Product({
      nom: req.body.nom,
      prix: req.body.prix,
      description: req.body.description,
      imageUrl,
      stock: req.body.stock,
      categorie_id: req.body.categorie_id,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Produit ajouté avec succès", product: newProduct });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Récupérer tous les produits
router.get("/", async (req, res) => {
  try {
    const produits = await Product.find();
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Récupérer un produit par ID
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

// ✅ Supprimer un produit
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

// ✅ Modifier un produit
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

/*
Ici je destructure req.body avec une valeur par défaut {} pour éviter undefined.
Le fallback imageBody || "" garantit que imageUrl n’est jamais undefined.
*/

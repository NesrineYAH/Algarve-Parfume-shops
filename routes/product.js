// routes/product.js
const express = require("express");
const router = express.Router();
const Product = require("../Model/product");
const uploads = require("../middleware/multer-config");
const { authMiddleware, isAdmin } = require("../middleware/auth");
const { product } = require("../controllers/product");


const {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct
} = require("../controllers/product");

// ➤ Ajouter un produit
router.post(
  "/add",
  authMiddleware,
  isAdmin,
  uploads.single("image"),
  addProduct
);

// ➤ Récupérer tous les produits
router.get("/", getProducts);

// ➤ Récupérer un produit par ID
router.get("/:id", getProductById);

// ➤ Supprimer un produit
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

// ➤ Modifier un produit
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  uploads.single("image"),
  updateProduct
);

module.exports = router;


/*
router.post("/add", authMiddleware, isAdmin, uploads.single("image"), async (req, res) => {
  console.log("req.file:", req.file); // DEBUG
  console.log("req.body:", req.body); // DEBUG
  try {
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl;

    const newProduct = new Product({
      nom: req.body.nom,
      prix: req.body.prix,
      description: req.body.description,
      stock: req.body.stock,
      imageUrl,  // 👈 ENREGISTRÉ DANS MONGODB !
      categorie_id: req.body.categorie_id,
    });


    if (!req.body.nom || !req.body.prix || !req.body.categorie_id) {
      return res
        .status(400)
        .json({ message: "Nom, prix et catégorie requis" });
    }
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Produit ajouté avec succès", product: newProduct });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
);


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


router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const produit = await Product.findByIdAndDelete(req.params.id);
    if (!produit)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ✅ Modifier un produit
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
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
*/
/*
router.put("/:id", authMiddleware, isAdmin, uploads.single("image"), async (req, res) => {
  try {
    const { nom, prix, description, stock, categorie_id } = req.body;

    const updatedData = { nom, prix, description, stock, categorie_id };

    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Produit introuvable" });

    res.json({ message: "Produit modifié avec succès", product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
*/


/*
Ici je destructure req.body avec une valeur par défaut {} pour éviter undefined.
Le fallback imageBody || "" garantit que imageUrl n’est jamais undefined.
//22/11/2025
req.file est undefined. Cela veut dire que Multer ne reçoit pas le fichier. On va diagnostiquer étape par étape.
*/

// controller/product.js
const Product = require("../Model/product");
require("dotenv").config();

// ➤ Ajouter un produit
exports.addProduct = async (req, res) => {
    try {
        const imageUrl = req.file
            ? `/uploads/${req.file.filename}`
            : req.body.imageUrl;

        if (!req.body.nom || !req.body.prix || !req.body.categorie_id) {
            return res.status(400).json({ message: "Nom, prix et catégorie requis" });
        }

        const newProduct = new Product({
            nom: req.body.nom,
            prix: req.body.prix,
            description: req.body.description,
            stock: req.body.stock,
            imageUrl,
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
};


// ➤ Récupérer tous les produits
exports.getProducts = async (req, res) => {
    try {
        const produits = await Product.find();
        res.json(produits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ➤ Récupérer un produit par ID
exports.getProductById = async (req, res) => {
    try {
        const produit = await Product.findById(req.params.id);
        if (!produit) return res.status(404).json({ message: "Produit non trouvé" });
        res.json(produit);   // ??Cela signifie : il renvoie directement l’objet produit, pas un objet enveloppé dans { product: ... }.
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ➤ Supprimer un produit
exports.deleteProduct = async (req, res) => {
    try {
        const produit = await Product.findByIdAndDelete(req.params.id);
        if (!produit) return res.status(404).json({ message: "Produit non trouvé" });
        res.json({ message: "Produit supprimé" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ➤ Modifier un produit
exports.updateProduct = async (req, res) => {
    try {
        const { nom, prix, description, stock, categorie_id } = req.body;
        const updatedData = { nom, prix, description, stock, categorie_id };

        if (req.file) {
            updatedData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedProduct)
            return res.status(404).json({ message: "Produit introuvable" });

        res.json({ message: "Produit modifié avec succès", product: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};











/*
Ici je destructure req.body avec une valeur par défaut {} pour éviter undefined.
Le fallback imageBody || "" garantit que imageUrl n’est jamais undefined.
//22/11/2025
req.file est undefined. Cela veut dire que Multer ne reçoit pas le fichier. On va diagnostiquer étape par étape.
*/

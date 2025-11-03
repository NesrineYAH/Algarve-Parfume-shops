const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

function isAdmin(req, res, next) {
  if ((req.user && req.user.role === "admin") || req.user.role === "vendeur") {
    next();
  } else {
    res.status(403).json({ error: "Accès interdit" });
  }
}

router.post("/add", isAuthorized, async (req, res) => {
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

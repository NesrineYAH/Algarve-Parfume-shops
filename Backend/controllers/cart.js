const Cart = require("../Model/Cart");


/* ➕ Ajouter au panier */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;// JWT middleware
    const { productId, nom, imageUrl, quantite = 1, options } = req.body;

       if (!productId || !options) {
      return res.status(400).json({ message: "Données produit manquantes" });
    }

    let cart = await Cart.findOne({ userId });

    // 🆕 Pas de panier → création
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
           productId,
            nom,
            imageUrl,
            quantite,
            options,
        ],
      });
    }

    const existing = cart.items.find(
      (i) =>
        i.productId.toString() === productId &&
        i.options.size === options.size
    );

    if (existing) {
      existing.quantite += quantite;
    } else {
      cart.items.push({
        productId,
        nom,
        imageUrl,
        quantite,
        options,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("❌ addToCart error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* 📦 Récupérer le panier */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (err) {
    console.error("❌ getCart error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* 🧹 Vider le panier */
exports.clearCart = async (req, res) => {
  await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { items: [] }
  );
  res.json({ message: "Panier vidé" });
};


/* Update: PUT /api/cart/update */
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size, unit, quantite } = req.body;

    if (!productId || quantite == null || !size || !unit)
      return res.status(400).json({ message: "productId, size, unit et quantite requis" });

    if (quantite < 1)
      return res.status(400).json({ message: "La quantité doit être ≥ 1" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Panier vide" });

    const item = cart.items.find(
      (i) =>
        i.productId.toString() === productId &&
        i.options.size === size &&
        i.options.unit === unit
    );

    if (!item) return res.status(404).json({ message: "Produit non trouvé dans panier" });

    item.quantite = quantite;
    await cart.save();

    res.json({ message: "Quantité mise à jour", cart });
  } catch (error) {
    console.error("Erreur updateQuantity :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* Delete: DELETE /api/cart/remove/:productId */
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size, unit } = req.body;

    if (!productId || !size || !unit)
      return res.status(400).json({ message: "productId, size et unit requis" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Panier vide" });

    cart.items = cart.items.filter(
      (i) =>
        !(
          i.productId.toString() === productId &&
          i.options.size === size &&
          i.options.unit === unit
        )
    );

    await cart.save();
    res.json({ message: "Produit supprimé", cart });
  } catch (error) {
    console.error("Erreur removeItem :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* Delete: DELETE /api/cart/clear // comment */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.json({ message: "Panier déjà vide" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Panier vidé", cart });
  } catch (error) {
    console.error("Erreur clearCart :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


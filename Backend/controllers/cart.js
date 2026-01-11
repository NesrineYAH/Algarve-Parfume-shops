const Cart = require("../Model/Cart");

/* ➕ Ajouter au panier */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, nom, imageUrl, quantite = 1, options } = req.body;

    if (!productId || !options || !options.size || !options.prix) {
      return res.status(400).json({ message: "Données produit incomplètes" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            nom,
            imageUrl,
            quantite,
            options,
          },
        ],
      });

      await cart.save();
      return res.json({ items: cart.items });
    }

    const existingItem = cart.items.find(
      (i) =>
        i.productId.toString() === productId.toString() &&
        i.options.size === options.size
    );

    if (existingItem) {
      existingItem.quantite += quantite;
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
    res.json({ items: cart.items });

  } catch (err) {
    console.error("❌ addToCart error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
/* 📦 Récupérer le panier */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.json({ items: [] });

    return res.json({ items: cart.items });

  } catch (err) {
    console.error("❌ getCart error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
/* 🔄 Mettre à jour la quantité */
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, size, unit, quantite } = req.body;

    if (!productId || quantite == null || !size || !unit)
      return res.status(400).json({ message: "productId, size, unit et quantite requis" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Panier vide" });

    const item = cart.items.find(
      (i) =>
        i.productId.toString() === productId.toString() &&
        i.options.size === size &&
        i.options.unit === unit
    );

    if (!item) return res.status(404).json({ message: "Produit non trouvé dans panier" });

    item.quantite = quantite;
    await cart.save();

    res.json({ items: cart.items });

  } catch (error) {
    console.error("Erreur updateQuantity :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
/* ❌ Supprimer un item */
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, size, unit } = req.body;

    if (!productId || !size || !unit)
      return res.status(400).json({ message: "productId, size et unit requis" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Panier vide" });

    cart.items = cart.items.filter(
      (i) =>
        !(
          i.productId.toString() === productId.toString() &&
          i.options.size === size &&
          i.options.unit === unit
        )
    );

    await cart.save();
    res.json({ items: cart.items });

  } catch (error) {
    console.error("Erreur removeItem :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
/* 🧹 Vider le panier */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.json({ message: "Panier déjà vide" });

    cart.items = [];
    await cart.save();

    res.json({ items: [] });

  } catch (error) {
    console.error("Erreur clearCart :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};




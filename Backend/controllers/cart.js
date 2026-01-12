//cart.js/controllers
const Cart = require("../Model/Cart");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { variantId, productId, nom, imageUrl, quantite = 1, options } = req.body;

    if (!variantId || !productId || !options || !options.size || !options.prix) {
      return res.status(400).json({ message: "Données produit incomplètes" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            variantId,
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

    const existingItem = cart.items.find(i => i.variantId === variantId);

    if (existingItem) {
      existingItem.quantite += quantite;
    } else {
      cart.items.push({
        variantId,
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

exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { variantId, delta } = req.body;

    if (!variantId || delta === undefined) {
      return res.status(400).json({ message: "variantId et delta requis" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Panier vide" });

    const item = cart.items.find(i => i.variantId === variantId);
    if (!item) return res.status(404).json({ message: "Produit non trouvé" });

    item.quantite = Math.max(1, item.quantite + delta);

    await cart.save();
    res.json({ items: cart.items });

  } catch (err) {
    console.error("❌ updateQuantity error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { variantId } = req.params;

    if (!variantId) {
      return res.status(400).json({ message: "variantId requis" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Panier vide" });

    cart.items = cart.items.filter(i => i.variantId !== variantId);
    await cart.save();

    res.json({ items: cart.items });
  } catch (err) {
    console.error("❌ removeItem error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* 🧹 Vider le panier */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.json({ items: [] });

    cart.items = [];
    await cart.save();

    res.json({ items: [] });

  } catch (error) {
    console.error("Erreur clearCart :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};





const Cart = require("../Model/Cart");

/* Create: POST /api/cart/add */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, nom, imageUrl, options } = req.body;

    if (!productId || !nom || !options) {
      return res.status(400).json({ message: "productId, nom et options requis" });
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
            quantite: 1,
            options,
          },
        ],
      });
    } else {
      const item = cart.items.find(
        (i) =>
          i.productId.toString() === productId &&
          i.options.size === options.size &&
          i.options.unit === options.unit
      );

      if (item) {
        item.quantite += 1;
      } else {
        cart.items.push({
          productId,
          nom,
          imageUrl,
          quantite: 1,
          options,
        });
      }
    }

    await cart.save();
    res.json({ message: "Produit ajouté au panier", cart });
  } catch (error) {
    console.error("Erreur addToCart :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* Read: GET /api/cart */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("Erreur getCart :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
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

/* Delete: DELETE /api/cart/clear */
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


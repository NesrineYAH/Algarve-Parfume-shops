const Cart = require("../model/Cart");

/* Create: Route : POST /api/cart/add */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // On récupère l’ID via JWT middleware
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId requis" });
    }

    // Cherche le panier du user
    let cart = await Cart.findOne({ user: userId });

    // Pas encore de panier ? On le crée
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity: 1 }],
      });
    } else {
      // Vérifie si le produit est déjà dans le panier
      const item = cart.items.find((i) => i.product.toString() === productId);

      if (item) {
        item.quantity += 1; // Maj quantité
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }
    }

    await cart.save();
    res.json({ message: "Produit ajouté au panier", cart });
  } catch (error) {
    console.error("Erreur addToCart :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* Read: Route : GET /api/cart */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product"); // récupère les infos produit

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("Erreur getCart :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* Update: Route : PUT /api/cart/update*/
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity == null)
      return res.status(400).json({ message: "productId et quantity requis" });

    if (quantity < 1)
      return res.status(400).json({ message: "La quantité doit être ≥ 1" });

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: "Panier vide" });

    const item = cart.items.find((i) => i.product.toString() === productId);

    if (!item)
      return res
        .status(404)
        .json({ message: "Produit non trouvé dans panier" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Quantité mise à jour", cart });
  } catch (error) {
    console.error("Erreur updateQuantity :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* Delete: Route : DELETE /api/cart/remove/:productId*/
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: "Panier vide" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    await cart.save();

    res.json({ message: "Produit supprimé", cart });
  } catch (error) {
    console.error("Erreur removeItem :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/*Route : DELETE /api/cart/clear*/
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.json({ message: "Panier déjà vide" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Panier vidé" });
  } catch (error) {
    console.error("Erreur clearCart :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

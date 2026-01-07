import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Charger le panier depuis localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  // 💾 Sauvegarde automatique
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // ➕ Ajouter au panier
  // product = Product Mongo
  // selectedOption = product.options[index]
  const addToCart = (product, selectedOption) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === product._id &&
          item.options.size === selectedOption.size &&
          item.options.unit === selectedOption.unit
      );

      if (existing) {
        return prev.map((item) =>
          item.productId === product._id &&
          item.options.size === selectedOption.size &&
          item.options.unit === selectedOption.unit
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          nom: product.nom,
          imageUrl: product.imageUrl,
          quantite: 1,
          options: {
            size: selectedOption.size,
            unit: selectedOption.unit,
            prix: Number(selectedOption.prix),
          },
        },
      ];
    });
  };

  // ➖ Modifier quantité
  const updateQuantity = (productId, size, unit, quantite) => {
    if (quantite <= 0) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId &&
        item.options.size === size &&
        item.options.unit === unit
          ? { ...item, quantite }
          : item
      )
    );
  };

  // ❌ Supprimer un article
  const removeFromCart = (productId, size, unit) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.options.size === size &&
            item.options.unit === unit
          )
      )
    );
  };

  // 🧹 Vider le panier
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // 💰 Total
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.options.prix * item.quantite,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

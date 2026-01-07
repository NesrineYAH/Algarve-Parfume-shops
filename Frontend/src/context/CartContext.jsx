import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  // 🔄 Indique quand le panier est prêt
  const [loading, setLoading] = useState(true);

  // 🛒 Charger le panier depuis localStorage
  const [cartItems, setCartItems] = useState([]);

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
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product._id
      );

      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          quantity: 1,
        },
      ];
    });
  };

  // ➖ Modifier quantité
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // ❌ Supprimer un produit
  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  // 🧹 Vider le panier
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // 💰 Total
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,      // 🔑 IMPORTANT
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


/*
const handleCheckout = () => {
  if (!user) {
    navigate("/login", { state: { redirectTo: "/checkout" } });
  } else {
    navigate("/checkout");
  }
};

*/











/*import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
}
*/
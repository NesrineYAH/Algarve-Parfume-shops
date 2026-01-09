import { createContext, useEffect, useState, useContext } from "react";
import * as CartService from "../Services/cart";
import { UserContext } from "./UserContext";
import axios from "axios";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fonction pour charger le panier depuis la DB
  const loadCart = async () => {
    if (!user) return setCartItems([]);
    try {
      const res = await axios.get("http://localhost:5001/api/carts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("❌ loadCart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Charger le panier à chaque login
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    loadCart();
  }, [user]);

  // ➕ Ajouter un article
  const addToCart = async (item) => {
    try {
      await CartService.addToCart(item);
      await loadCart();
    } catch (err) {
      console.error("❌ addToCart error:", err);
    }
  };

  // ➖ Mettre à jour la quantité
  const updateQuantity = async (productId, quantity) => {
    try {
      await CartService.updateQuantity(productId, quantity);
      await loadCart();
    } catch (err) {
      console.error("❌ updateQuantity error:", err);
    }
  };

  // ❌ Supprimer un produit
  const removeFromCart = async (productId) => {
    try {
      await CartService.removeItem(productId);
      await loadCart();
    } catch (err) {
      console.error("❌ removeFromCart error:", err);
    }
  };

  // 🧹 Vider le panier
  const clearCart = async () => {
    try {
      await CartService.clearCart();
      setCartItems([]);
    } catch (err) {
      console.error("❌ clearCart error:", err);
    }
  };

  // 💰 Total
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.options.prix * i.quantite,
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




/* 09/01/26
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
*/


/* 09/01/2026
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
*/
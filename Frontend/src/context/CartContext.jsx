import { createContext, useEffect, useState, useContext, useMemo } from "react";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

  // 🔄 Chargement du panier
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!user?._id) {
      // 🟡 Non connecté → afficher panier local
      setCartItems(localCart);
      return;
    }

    // 🟢 Connecté → fusion avec backend
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems(localCart);
      return;
    }

    fetch("http://localhost:5001/api/carts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const backendCart = data.items || [];
        const mergedCart = mergeCarts(localCart, backendCart);
        setCartItems(mergedCart);

        // Synchroniser le panier backend
        fetch("http://localhost:5001/api/carts/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user._id, cartItems: mergedCart }),
        });

        localStorage.removeItem("cart");
      })
      .catch((err) => {
        console.error("Erreur sync panier :", err);
        setCartItems(localCart);
      });
  }, [user]);

  // ➕ Ajouter au panier
  const addToCartContext = async (item) => {
    if (!user?._id) {
      // NON CONNECTÉ → panier local
      setCartItems((prev) => {
        const updated = [...prev];
        const exist = updated.find((i) => i.variantId === item.variantId);

        if (exist) {
          exist.quantite += item.quantite;
        } else {
          updated.push(item);
        }

        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // CONNECTÉ → backend
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:5001/api/carts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      // Recharger panier backend
      const res = await fetch("http://localhost:5001/api/carts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("❌ addToCart error", err);
    }
  };

  // 🔹 Calcul du total
  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.options?.prix || 0) * (item.quantite || 0), 0);
  }, [cartItems]);

  // 🔹 Fusion des paniers
  const mergeCarts = (localCart, backendCart) => {
    const map = new Map();

    [...backendCart, ...localCart].forEach((item) => {
      if (map.has(item.variantId)) {
        map.get(item.variantId).quantite += item.quantite;
      } else {
        map.set(item.variantId, { ...item });
      }
    });

    return Array.from(map.values());
  };
  //11/01 copilot
const updateQuantity = async (variantId, delta) => {
  if (!user?._id) {
    // local
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.variantId === variantId
          ? { ...item, quantite: Math.max(1, item.quantite + delta) }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
    return;
  }

  // backend
  const token = localStorage.getItem("token");
  await fetch("http://localhost:5001/api/carts/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ variantId, delta }),
  });

  const res = await fetch("http://localhost:5001/api/carts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  setCartItems(data.items || []);
};
//11/01/ copilot
const removeFromCart = async (variantId) => {
  if (!user?._id) {
    const updated = cartItems.filter(item => item.variantId !== variantId);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    return;
  }

  const token = localStorage.getItem("token");
  await fetch("http://localhost:5001/api/carts/remove", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ variantId }),
  });

  const res = await fetch("http://localhost:5001/api/carts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  setCartItems(data.items || []);
};


  return (
    <CartContext.Provider
      value={{
  cartItems, addToCartContext, updateQuantity, removeFromCart, setCartItems, totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;












/*
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

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    loadCart();
  }, [user]);

const addToCart = async (item) => {
  await CartService.addToCart(item);
  await loadCart();
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

  const clearCart = async () => {
    try {
      await CartService.clearCart();
      setCartItems([]);
    } catch (err) {
      console.error("❌ clearCart error:", err);
    }
  };

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
*/







/*
  const addToCart = async (item) => {
    try {
      await CartService.addToCart(item);
      await loadCart();
    } catch (err) {
      console.error("❌ addToCart error:", err);
    }
  };
*/


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
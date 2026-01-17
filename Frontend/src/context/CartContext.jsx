import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

  // 🔄 Fusion panier local + backend (clé = variantId)

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
 /*
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    // 🟡 Non connecté
    if (!user?._id) {
      setCartItems(localCart);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems(localCart);
      return;
    }

    // 🟢 Connecté
    fetch("http://localhost:5001/api/carts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const backendCart = data.items || [];
        const merged = mergeCarts(localCart, backendCart);

        setCartItems(merged);
console.log(cartItems);

        // 🔄 Sync backend
        fetch("http://localhost:5001/api/carts/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cartItems: merged }),
        });

        localStorage.removeItem("cart");
      })
      .catch(() => setCartItems(localCart));
  }, [user]);
*/
// 1️⃣ Charger le panier local une seule fois
useEffect(() => {
  if (!user?._id) {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(localCart);
  }
}, []); // 👈 se lance une seule fois au montage


// 2️⃣ Charger le panier backend quand user se connecte
useEffect(() => {
  if (!user?._id) return;

  const token = localStorage.getItem("token");
  if (!token) return;

  const localCart = JSON.parse(localStorage.getItem("cart")) || [];

  fetch("http://localhost:5001/api/carts", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => {
      const backendCart = data.items || [];
      const merged = mergeCarts(localCart, backendCart);

      setCartItems(merged);

      fetch("http://localhost:5001/api/carts/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItems: merged }),
      });

      localStorage.removeItem("cart");
    })
    .catch(() => setCartItems(localCart));
}, [user]);

  // ➕ Ajouter
  const addToCartContext = async (item) => {
    if (!user?._id) {
      setCartItems((prev) => {
        const updated = [...prev];
        const exist = updated.find((i) => i.variantId === item.variantId);

        if (exist) exist.quantite += item.quantite;
        else updated.push(item);

        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    const token = localStorage.getItem("token");

    await fetch("http://localhost:5001/api/carts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });

    const res = await fetch("http://localhost:5001/api/carts", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setCartItems(data.items || []);
  };
  // ➕➖ Modifier quantité
const updateQuantity = async (variantId, delta) => {
  if (!user?._id) {
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

  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5001/api/carts/updateQuantity", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      variantId,
      delta: Number(delta), // ⭐ CRUCIAL
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("UPDATE ERROR :", err);
    return;
  }

  const data = await res.json();
  setCartItems(data.items || []);
};
  // ❌ Supprimer
const removeFromCart = async (variantId) => {
  if (!user?._id) {
    const updated = cartItems.filter(i => i.variantId !== variantId);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    return;
  }

  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5001/api/carts/removeItem/${variantId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    console.error("REMOVE ERROR :", err);
    return;
  }

  const data = await res.json();
  setCartItems(data.items || []);
};

  // 💰 Total
  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + (item.options?.prix || 0) * item.quantite,
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCartContext,
        updateQuantity,
        removeFromCart,
        totalPrice,
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
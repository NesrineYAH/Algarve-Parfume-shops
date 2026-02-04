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
      const key = item.variantId.toString();

      if (map.has(key)) {
        map.get(key).quantite += item.quantite;
      } else {
        map.set(key, item);
      }
    });

    return Array.from(map.values());
  };

  // 📦 Charger panier local si user NON connecté
  useEffect(() => {
    if (!user?._id) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(localCart);
    }
  }, [user]);

  // 🔐 Sync panier local → backend au login
  useEffect(() => {
    if (!user?._id) return;

    const syncCarts = async () => {
      try {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];

        // 1️⃣ récupérer panier backend (cookie JWT auto)
        const res = await fetch("http://localhost:5001/api/carts", {
          credentials: "include",
        });
        const data = await res.json();
        const backendCart = data.items || [];

        // 2️⃣ fusion
        const mergedCart = mergeCarts(localCart, backendCart);

        // 3️⃣ sync backend
        await fetch("http://localhost:5001/api/carts/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ cartItems: mergedCart }),
        });

        // 4️⃣ clean localStorage
        localStorage.removeItem("cart");

        // 5️⃣ update state
        setCartItems(mergedCart);
      } catch (err) {
        console.error("❌ cart sync error:", err);
      }
    };

    syncCarts();
  }, [user]);

  // ➕ Ajouter au panier
  const addToCartContext = async (item) => {
    // 👤 NON connecté → localStorage
    if (!user?._id) {
      setCartItems((prev) => {
        const updated = [...prev];
        const exist = updated.find(
          (i) => i.variantId.toString() === item.variantId.toString()
        );

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

    // 🔐 CONNECTÉ → backend
    try {
      await fetch("http://localhost:5001/api/carts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(item),
      });

      const res = await fetch("http://localhost:5001/api/carts", {
        credentials: "include",
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("❌ addToCart error:", err);
    }
  };

  // ➕➖ Modifier quantité
  const updateQuantity = async (variantId, delta) => {
    // 👤 NON connecté
    if (!user?._id) {
      setCartItems((prev) => {
        const updated = prev.map((item) =>
          item.variantId.toString() === variantId.toString()
            ? {
                ...item,
                quantite: Math.max(1, item.quantite + delta),
              }
            : item
        );

        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // 🔐 CONNECTÉ
    try {
      const res = await fetch(
        "http://localhost:5001/api/carts/updateQuantity",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            variantId,
            delta: Number(delta),
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("❌ UPDATE ERROR:", err);
        return;
      }

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("❌ updateQuantity error:", err);
    }
  };

  // ❌ Supprimer du panier
  const removeFromCart = async (variantId) => {
    // 👤 NON connecté
    if (!user?._id) {
      const updated = cartItems.filter(
        (i) => i.variantId.toString() !== variantId.toString()
      );
      setCartItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
      return;
    }

    // 🔐 CONNECTÉ
    try {
      const res = await fetch(
        `http://localhost:5001/api/carts/removeItem/${variantId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("❌ REMOVE ERROR:", err);
        return;
      }

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("❌ removeFromCart error:", err);
    }
  };

  // 💰 Total panier
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



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


useEffect(() => { 
    if (!user?._id) {
     const localCart = JSON.parse(localStorage.getItem("cart")) || [];
     setCartItems(localCart);
     console.log("CartContext cartItems:", cartItems);

     }
    }, [user]);

useEffect(() => {
  const localCart = JSON.parse(localStorage.getItem("cart")) || [];
  setCartItems(localCart);
}, []);


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
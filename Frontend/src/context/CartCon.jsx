// CartContext.jsx 
import React, { createContext } from "react";
import { UserContext } from "./UserContext";


export const CartContext = createContext();
class CartProvider extends React.Component {
  static contextType = UserContext;

  componentDidMount() {
    const cartData = localStorage.getItem("cart");
    this.setState({
      cartItems: cartData ? JSON.parse(cartData) : [],
      cartReady: true,
    });
  }

  addToCartContext = (item) => {
    const { user, loadingUser } = this.context;

    // ⛔ attendre UserContext
    if (loadingUser) return;

    // 👤 INVITÉ
    if (!user) {
      this.setState((prev) => {
        const exist = prev.cartItems.find(
          (i) => i.variantId === item.variantId
        );

        const newCart = exist
          ? prev.cartItems.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantite: i.quantite + item.quantite }
                : i
            )
          : [...prev.cartItems, item];

        localStorage.setItem("cart", JSON.stringify(newCart));
        return { cartItems: newCart };
      });
      return;
    }

    // 👤 CONNECTÉ (pour l’instant local aussi)
    this.setState((prev) => {
      const exist = prev.cartItems.find(
        (i) => i.variantId === item.variantId
      );

      const newCart = exist
        ? prev.cartItems.map((i) =>
            i.variantId === item.variantId
              ? { ...i, quantite: i.quantite + item.quantite }
              : i
          )
        : [...prev.cartItems, item];

      localStorage.setItem("cart", JSON.stringify(newCart));
      return { cartItems: newCart };
    });
  };
}




/* 18/01/2026
export const CartContext = createContext();

class CartProvider extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);

    const cartData = localStorage.getItem("cart");
console.log("INIT CART", cartData);

    this.state = {
        cartItems: cartData ? JSON.parse(cartData) : [],
      cartReady: true, 
    };
  }


  saveCartToLocalStorage = (cartItems) => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Erreur sauvegarde panier :", err);
    }
  };


  addToCartContext = (item) => {
    const token = localStorage.getItem("token");

    // 👤 MODE INVITÉ
    if (!token) {
      this.setState((prev) => {
        const exist = prev.cartItems.find(
          (i) => i.variantId === item.variantId
        );

        let newCart;
        if (exist) {
          newCart = prev.cartItems.map((i) =>
            i.variantId === item.variantId
              ? { ...i, quantite: i.quantite + item.quantite }
              : i
          );
        } else {
          newCart = [...prev.cartItems, item];
        }

        this.saveCartToLocalStorage(newCart);
        return { cartItems: newCart };
      });
      return;
    }

    // 👤 MODE CONNECTÉ (API plus tard)
    console.log("Utilisateur connecté → API à implémenter");
  };


  updateQuantity = (variantId, delta) => {
    const token = localStorage.getItem("token");

    if (!token) {
      this.setState((prev) => {
        const newCart = prev.cartItems.map((item) =>
          item.variantId === variantId
            ? { ...item, quantite: Math.max(1, item.quantite + delta) }
            : item
        );

        this.saveCartToLocalStorage(newCart);
        return { cartItems: newCart };
      });
    }
  };


  removeFromCart = (variantId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      this.setState((prev) => {
        const newCart = prev.cartItems.filter(
          (i) => i.variantId !== variantId
        );
        this.saveCartToLocalStorage(newCart);
        return { cartItems: newCart };
      });
    }
  };

  clearCart = () => {
    this.setState({ cartItems: [] });
    localStorage.removeItem("cart");
  };

  render() {

      if (!this.state.cartReady) {
      return null; 
    }
    const { cartItems } = this.state;

    const totalPrice = cartItems.reduce(
      (acc, item) => acc + (item.options?.prix || 0) * item.quantite,
      0
    );

    const totalItems = cartItems.reduce(
      (acc, item) => acc + item.quantite,
      0
    );

    return (
      <CartContext.Provider
        value={{
          cartItems,
          addToCartContext: this.addToCartContext,
          updateQuantity: this.updateQuantity,
          removeFromCart: this.removeFromCart,
          clearCart: this.clearCart,
          totalPrice,
          totalItems,
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

export default CartProvider;
*/







/*
const CartProvider = ({ children }) => {
  const { user, loadingUser } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

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
    if (loadingUser) return;

    if (!user?._id || !token) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(localCart);
      return;
    }

    const token = localStorage.getItem("token");
     setLoadingCart(false);
    if (!token) return;

    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    fetch("http://localhost:5001/api/carts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
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
      .catch(() => {
        setCartItems(localCart);
      });
  }, [user, loadingUser]);

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

  const updateQuantity = async (variantId, delta) => {
    if (!user?._id) {
      setCartItems((prev) => {
        const updated = prev.map((item) =>
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

    const res = await fetch(
      "http://localhost:5001/api/carts/updateQuantity",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ variantId, delta }),
      }
    );

    const data = await res.json();
    setCartItems(data.items || []);
  };


  const removeFromCart = async (variantId) => {
    if (!user?._id) {
      const updated = cartItems.filter((i) => i.variantId !== variantId);
      setCartItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5001/api/carts/removeItem/${variantId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setCartItems(data.items || []);
  };

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
*/



 /* 16/01/2026
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
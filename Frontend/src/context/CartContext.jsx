import { createContext, useEffect, useState } from "react";
import { getCart } from "../Services/cart"; // ton service axios
import { addToCart as addToCartAPI } from "../Services/cart";


export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Erreur fetch cart :", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  fetchCart();
}, []);

/*
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);
*/

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);
const addToCart = async (product, selectedOption) => {
  try {
    const res = await addToCartAPI(product._id);
    const cartFromServer = res.data.cart.items.map(i => ({
      productId: i.productId,
      nom: i.nom,
      imageUrl: i.imageUrl,
      quantite: i.quantite,
      options: i.options,
    }));
    setCartItems(cartFromServer);
  } catch (err) {
    console.error("Erreur addToCart :", err);
  }
};

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


const removeFromCart = async (productId) => {
  try {
    const res = await removeItem(productId); // service axios
    const updated = res.data.cart.items.map(i => ({
      productId: i.productId,
      nom: i.nom,
      imageUrl: i.imageUrl,
      quantite: i.quantite,
      options: i.options,
    }));
    setCartItems(updated);
  } catch (err) {
    console.error(err);
  }
};

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };


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
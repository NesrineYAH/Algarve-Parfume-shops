import React, { useContext, useEffect } from "react";
import "./Cart.scss";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import { UserContext } from "../../context/UserContext";
import { CartContext } from "../../context/CartContext";

export default function Cart() {
  const { user } = useContext(UserContext);
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalPrice,
    setCartItems, // pour synchronisation après login
  } = useContext(CartContext);

  const navigate = useNavigate();
  const currentStep = 1;

  // Synchroniser le panier local avec le backend après connexion
  useEffect(() => {
    if (!user) return;
    console.log("USER =", user);
console.log("user._id =", user?._id);
console.log("user.userId =", user?.userId);


    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Si le local cart est vide, on récupère juste le panier backend
    fetch(`http://localhost:5001/api/carts/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        const backendCart = data.cartItems || [];

        // Fusionner panier local + backend
        const mergedCart = mergeCarts(localCart, backendCart);

        setCartItems(mergedCart);

        // Envoyer le panier fusionné au backend
        fetch(`http://localhost:5001/api/carts/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, cartItems: mergedCart }),
        });

        // Supprimer le panier local
        localStorage.removeItem("cart");
      })
      .catch((err) => console.error("Erreur sync panier :", err));
  }, [user, setCartItems]);

  const mergeCarts = (localCart, backendCart) => {
    const map = new Map();
    [...localCart, ...backendCart].forEach((item) => {
      if (map.has(item.variantId)) {
        map.get(item.variantId).quantite += item.quantite;
      } else {
        map.set(item.variantId, { ...item });
      }
    });
    return Array.from(map.values());
  };

  const handleNextStep = () => {
    if (cartItems.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    if (!user) {
      navigate("/Authentification", {
        state: { redirectTo: "/checkout" },
      });
      return;
    }

    navigate("/checkout");
  };

  const increaseQuantity = (variantId) => {
    updateQuantity(variantId, 1);
  };

  const decreaseQuantity = (variantId) => {
    updateQuantity(variantId, -1);
  };

  const removeItem = (variantId) => {
    removeFromCart(variantId);
  };

  return (
    <div className="cart-container">
      <CheckoutSteps step={currentStep} />
      <h1>🛒 Votre Panier</h1>

      {cartItems.length === 0 ? (
        <p className="empty-message">Votre panier est vide.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div className="cart-item" key={`${item.variantId}-${index}`}>
              <img
                src={`http://localhost:5001${item.imageUrl}`}
                alt={item.nom}
                className="cart-item__img"
              />

              <div className="item-details">
                <h3>{item.nom}</h3>
                <p>{Number(item.options?.prix || 0).toFixed(2)} €</p>
                <p>
                  Option : {item.options?.size} {item.options?.unit}
                </p>

                <div className="quantity-control">
                  <button onClick={() => decreaseQuantity(item.variantId)}>
                    -
                  </button>
                  <span>{item.quantite}</span>
                  <button onClick={() => increaseQuantity(item.variantId)}>
                    +
                  </button>
                </div>
              </div>

              <Trash2
                className="delete-icon"
                onClick={() => removeItem(item.variantId)}
              />
            </div>
          ))}

          <div className="cart-summary">
            <h2>Total : {totalPrice.toFixed(2)} €</h2>
            <button className="checkout-btn" onClick={handleNextStep}>
              Étape suivante
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



/*
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, [])

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (variantId) => {
    updateCart(
      cart.map((item) =>
        item.variantId === variantId
          ? { ...item, quantite: item.quantite + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (variantId) => {
    updateCart(
      cart.map((item) =>
        item.variantId === variantId && item.quantite > 1
          ? { ...item, quantite: item.quantite - 1 }
          : item
      )
    );
  };

  const removeItem = (variantId) => {
    updateCart(cart.filter((item) => item.variantId !== variantId));
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.options?.prix || 0) * Number(item.quantite || 0),
    0
  );

  const handleNextStep = () => {
    if (cart.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    // 🔐 Si non connecté → login puis checkout
    if (!user) {
      navigate("/Authentification", {
        state: { redirectTo: "/checkout" },
      });
      return;
    }

    // ✅ Connecté → checkout
    navigate("/checkout");
  };

*/
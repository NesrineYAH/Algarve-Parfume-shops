import React, { useContext } from "react";
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
  } = useContext(CartContext);

  const navigate = useNavigate();

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

  return (
    <div className="cart-container">
      <CheckoutSteps step={1} />
      <h1>🛒 Votre Panier</h1>

      {cartItems.length === 0 ? (
        <p className="empty-message">Votre panier est vide.</p>
      ) : (
        <div className="cart-items">
        {cartItems.map((item) => (
  <div className="cart-item" key={item.variantId}>
    <img
      src={`http://localhost:5001${item.imageUrl}`}
      alt={item.nom}
      className="cart-item__img"
      onClick={() => navigate(`/produit/${item.productId}`)}
    />

    <div className="item-details">
      <h3>{item.nom}</h3>
      <p>{Number(item.options?.prix || 0).toFixed(2)} €</p>
      <p>
        Option : {item.options?.size} {item.options?.unit}
      </p>

      <div className="quantity-control">
     <button onClick={() => updateQuantity(item.variantId, -1)}>-</button>

        <span>{item.quantite}</span>
        <button onClick={() => updateQuantity(item.variantId, 1)}>+</button>
      </div>
    </div>

    <Trash2       className="delete-icon"
onClick={() => removeFromCart(item.variantId)} />

  </div>
))}


          <div className="cart-summary">
            {/* <h2>Total : {totalPrice.toFixed(2)} €</h2> */}
            <h2>Total : {Number(totalPrice || 0).toFixed(2)} €</h2>

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
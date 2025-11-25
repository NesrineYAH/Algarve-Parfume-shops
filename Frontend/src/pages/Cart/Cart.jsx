import React, { useState, useEffect } from "react";
import "./Cart.scss";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const currentStep = 1; // par exemple, on est à l'étape 1 : Panier

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (_id) => {
    const updated = cart.map((item) =>
      item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQuantity = (_id) => {
    const updated = cart.map((item) =>
      item._id === _id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updated);
  };

  const removeItem = (_id) => {
    const updated = cart.filter((item) => item._id !== _id);
    updateCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.prix * item.quantity, 0);

  return (
    <div className="cart-container">
      {/* Affiche le composant avec l'étape active */}
      <CheckoutSteps step={currentStep} />

      <h1>🛒 Votre Panier</h1>

      {cart.length === 0 ? (
        <p className="empty-message">Votre panier est vide.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item._id}>
              <img
                src={`http://localhost:5001${item.imageUrl}`}
                alt={item.nom}
                className="cart-item__img"
              />

              <div className="item-details">
                <h3>{item.nom}</h3>
                <p>{item.prix.toFixed(2)} €</p>

                <div className="quantity-control">
                  <button onClick={() => decreaseQuantity(item._id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item._id)}>+</button>
                </div>
              </div>

              <Trash2
                className="delete-icon"
                onClick={() => removeItem(item._id)}
              />
            </div>
          ))}

          <div className="cart-summary">
            <h2>Total: {total.toFixed(2)} €</h2>
            <Link to="/Orders">
              <button className="checkout-btn">Passer la commande</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

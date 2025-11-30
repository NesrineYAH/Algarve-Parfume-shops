import React, { useState, useEffect } from "react";
import "./Cart.scss";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import OrderService from "../../Services/orderService";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [deliveryMode, setDeliveryMode] = useState("domicile");
  const [address, setAddress] = useState("");
  const currentStep = 1;

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (_id, optionSize) => {
    const updated = cart.map((item) =>
      item._id === _id && item.option?.size === optionSize
        ? { ...item, quantite: item.quantite + 1 }
        : item
    );
    updateCart(updated);
  };

  const decreaseQuantity = (_id, optionSize) => {
    const updated = cart.map((item) =>
      item._id === _id && item.option?.size === optionSize && item.quantite > 1
        ? { ...item, quantite: item.quantite - 1 }
        : item
    );
    updateCart(updated);
  };

  const removeItem = (_id, optionSize) => {
    const updated = cart.filter(
      (item) => !(item._id === _id && item.option?.size === optionSize)
    );
    updateCart(updated);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.option?.prix || 0) * Number(item.quantite || 0),
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Votre panier est vide");
      return;
    }
    try {
      const items = cart.map((item) => ({
        productId: item._id,
        nom: item.nom,
        quantite: item.quantite,
        imageUrl: item.imageUrl,
        options: {
          size: item.options?.size,
          unit: item.options?.unit,
          prix: Number(item.option?.prix || 0),
        },
      }));

      const orderData = {
        items,
        totalPrice: total,
        delivery: {
          type: deliveryMode,
          address: deliveryMode === "domicile" ? address : "",
        },
      };

      await OrderService.createOrder(orderData);
      updateCart([]);
      alert("✅ Commande créée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la commande :", error);
      alert("❌ Impossible de créer la commande");
    }
  };

  return (
    <div className="cart-container">
      <CheckoutSteps step={currentStep} />
      <h1>🛒 Votre Panier</h1>

      {cart.length === 0 ? (
        <p className="empty-message">Votre panier est vide.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div
              className="cart-item"
              key={item._id + "-" + (item.option?.size || "")}
            >
              <img
                src={`http://localhost:5001${item.imageUrl}`}
                alt={item.nom}
                className="cart-item__img"
              />

              <div className="item-details">
                <h3>{item.nom}</h3>
                <p>{(item.option?.prix || 0).toFixed(2)} €</p>
                <p>
                  Option choisie : {item.option?.size} {item.option?.unit}
                </p>

                <div className="quantity-control">
                  <button
                    onClick={() =>
                      decreaseQuantity(item._id, item.option?.size)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantite}</span>
                  <button
                    onClick={() =>
                      increaseQuantity(item._id, item.option?.size)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <Trash2
                className="delete-icon"
                onClick={() => removeItem(item._id, item.option?.size)}
              />
            </div>
          ))}

          <div className="cart-summary">
            <h2>Total: {total.toFixed(2)} €</h2>

            <Link to="/Checkout">
              <button className="checkout-btn" onClick={handleCheckout}>
                étape suivante
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/*
export default function Cart() {
  const [cart, setCart] = useState([]);
  const currentStep = 1;
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
*/
/*
// Version 2
export default function Cart() {
  const [cart, setCart] = useState([]);
  const currentStep = 1;

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

  //const total = cart.reduce((sum, item) => sum + item.prix * item.quantity, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + item.prix * item.quantity,
    0
  );

  // ➤ Fonction pour envoyer la commande
  const handleCheckout = async () => {
    try {
      const items = cart.map((item) => ({
        productId: item._id, // id du produit
        name: item.nom, // nom du produit
        prix: Number(item.prix), // s'assurer que c'est un Number
        imageUrl: item.imageUrl, // ← inclure l'image
        quantity: item.quantity,
      }));

      const orderData = {
        items,
        totalPrice: items.reduce((sum, it) => sum + it.prix * it.quantity, 0),
        address: "Adresse de livraison à définir", // remplace par un champ saisi
      };

      await OrderService.createOrder(orderData);
      updateCart([]);
      alert("✅ Commande créée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la commande :", error);
      alert("❌ Impossible de créer la commande");
    }
  };

  return (
    <div className="cart-container">
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
            <button className="checkout-btn" onClick={handleCheckout}>
              Passer la commande
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
*/

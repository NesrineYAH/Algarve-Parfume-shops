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

  // const increaseQuantity = (_id, optionSize) => {
  //   const updated = cart.map((item) =>
  //     item._id === _id && item.options?.size === optionSize
  //       ? { ...item, quantite: item.quantite + 1 }
  //       : item
  //   );
  //   updateCart(updated);
  // };

  const increaseQuantity = (variantId) => {
    const updated = cart.map((item) =>
      item.variantId === variantId
        ? { ...item, quantite: item.quantite + 1 }
        : item
    );
    updateCart(updated);
  };

  // const decreaseQuantity = (_id, optionSize) => {
  //   const updated = cart.map((item) =>
  //     item._id === _id && item.options?.size === optionSize && item.quantite > 1
  //       ? { ...item, quantite: item.quantite - 1 }
  //       : item
  //   );
  //   updateCart(updated);
  // };

  const decreaseQuantity = (variantId) => {
    const updated = cart.map((item) =>
      item.variantId === variantId && item.quantite > 1
        ? { ...item, quantite: item.quantite - 1 }
        : item
    );
    updateCart(updated);
  };

  // const removeItem = (_id, optionSize) => {
  //   const updated = cart.filter(
  //     (item) => !(item._id === _id && item.options?.size === optionSize)
  //   );
  //   updateCart(updated);
  // };

  const removeItem = (variantId) => {
    const updated = cart.filter((item) => item.variantId !== variantId);
    updateCart(updated);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.options?.prix || 0) * Number(item.quantite || 0),
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    try {
      const itemsForOrder = cart.map((item) => ({
        productId: item.productId, // ObjectId du produit
        nom: item.nom,
        quantite: Number(item.quantite),
        imageUrl: item.imageUrl,
        options: {
          size: Number(item.options?.size),
          unit: item.options?.unit || "ml",
          prix: Number(item.options?.prix || 0),
        },
      }));

      const orderData = {
        items: itemsForOrder,
        totalPrice: Number(total),
        delivery: {
          type: deliveryMode,
          address: deliveryMode === "domicile" ? address : "",
        },
      };

      await OrderService.createOrder(orderData);

      // Vider le panier
      updateCart([]);
      alert("✅ Article bien vérifiée !");
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
            // <div
            //   className="cart-item"
            //   key={item._id + "-" + (item.options?.size || "")}>
            <div className="cart-item" key={item.variantId}>
              <img
                src={`http://localhost:5001${item.imageUrl}`}
                alt={item.nom}
                className="cart-item__img"
              />

              <div className="item-details">
                <h3>{item.nom}</h3>
                <p>{(item.options?.prix || 0).toFixed(2)} €</p>
                <p>
                  Option choisie : {item.options?.size} {item.options?.unit}
                </p>

                <div className="quantity-control">
                  <button
                    // onClick={() =>
                    //   decreaseQuantity(item._id, item.options?.size)
                    // }
                    onClick={() => decreaseQuantity(item.variantId)}
                  >
                    -
                  </button>

                  <span>{item.quantite}</span>
                  <button
                    onClick={() => increaseQuantity(item.variantId)}
                    // onClick={() =>increaseQuantity(item._id, item.options?.size)}
                  >
                    +
                  </button>
                </div>
              </div>

              <Trash2
                className="delete-icon"
                //   onClick={() => removeItem(item._id, item.options?.size)}
                onClick={() => removeItem(item.variantId)}
              />
            </div>
          ))}

          <div className="cart-summary">
            <h2>Total: {total.toFixed(2)} €</h2>

            <button>PASSER à La prochaine étape </button>

            <Link to="/checkout">
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

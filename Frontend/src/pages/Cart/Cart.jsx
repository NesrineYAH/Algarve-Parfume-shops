import React, { useState, useEffect } from "react";
import "./Cart.scss";
import { Trash2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import OrderService from "../../Services/orderService";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [deliveryMode, setDeliveryMode] = useState("domicile");
  const [address, setAddress] = useState("");
  const currentStep = 1;
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (variantId) => {
    const updated = cart.map((item) =>
      item.variantId === variantId
        ? { ...item, quantite: item.quantite + 1 }
        : item
    );
    updateCart(updated);
  };

  const decreaseQuantity = (variantId) => {
    const updated = cart.map((item) =>
      item.variantId === variantId && item.quantite > 1
        ? { ...item, quantite: item.quantite - 1 }
        : item
    );
    updateCart(updated);
  };

  const removeItem = (variantId) => {
    const updated = cart.filter((item) => item.variantId !== variantId);
    updateCart(updated);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.options?.prix || 0) * Number(item.quantite || 0),
    0
  );

  const handlePreOrder = async () => {
    if (cart.length === 0) {
      alert("Votre panier est vide");
      return;
    }
    //  const variantId = `${product._id}-${selectedOption.size}-${selectedOption.unit}`;

    const itemsForOrder = cart.map((item) => ({
      productId: item.productId,
      variantId: item.variantId, // ✅ ajouter la référence de la variante
      nom: item.nom,
      quantite: Number(item.quantite),
      imageUrl: item.imageUrl,
      options: {
        size: Number(item.options?.size),
        unit: item.options?.unit || "ml",
        prix: Number(item.options?.prix || 0),
      },
    }));

    const preOrderData = {
      items: itemsForOrder,
      totalPrice: Number(total),
      status: "pending",
      paymentStatus: "pending",
      delivery: {
        type: deliveryMode,
        address: deliveryMode === "domicile" ? address : "",
      },
    };

    try {
      let preOrderId = localStorage.getItem("preOrderId");

      if (preOrderId) {
        await OrderService.updateOrder(preOrderId, preOrderData);
        console.log("Pré-commande mise à jour :", preOrderId);
      } else {
        const response = await OrderService.createPreOrder(preOrderData);
        preOrderId = response.preOrder._id; // ✅ récupère correctement l'ID
        localStorage.setItem("preOrderId", preOrderId);
        console.log("Nouvelle pré-commande créée :", preOrderId);
      }

      alert("Pré-commande enregistrée !");
      navigate("/checkout");
    } catch (error) {
      console.error("Erreur lors de la pré-commande :", error);
      alert("Impossible d'enregistrer la pré-commande");
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
          {cart.map((item, index) => (
            <div className="cart-item" key={`${item.variantId}-${index}`}>
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
            <h2>Total: {total.toFixed(2)} €</h2>

            <button className="checkout-btn" onClick={handlePreOrder}>
              étape suivante
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

//Frontend/src/pages/Payment.jsx
import React, { useState, useContext, useEffect } from "react";
import "./Payment.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import { loadStripe } from "@stripe/stripe-js";
import PaymentService from "../../Services/paymentService";
import OrderService from "../../Services/orderService";


export default function Payment() {
  const navigate = useNavigate();
  const { cartItems, loading: cartLoading } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  const location = useLocation();


  // Vérifier si la commande est déjà payée
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");

  if (!sessionId) return;

  const confirmPayment = async () => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/orders/confirm-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ sessionId }),
        }
      );

      if (!res.ok) throw new Error("Confirmation paiement échouée");

      const data = await res.json();
      setOrder(data.order);
    } catch (err) {
      console.error("❌ Erreur confirmation paiement:", err);
    }
  };

  confirmPayment();
}, [location.search]);

  const orderFromState = location.state?.order;

  // Calcul du total
  const total = (orderFromState ? orderFromState.items : cartItems).reduce(
    (sum, item) =>
      sum +
      parseFloat(item.options.prix.toString().replace(",", ".")) *
        Number(item.quantite || 1),
    0
  );

const handleStripePayment = async () => {
  try {
    setLoading(true);
    setError(null);

    const orderId =
      location.state?.orderId || localStorage.getItem("preOrderId");

    let stripeUrl = "";
    let itemsToPay = [];

    if (orderId) {
      stripeUrl = `http://localhost:5001/api/stripe/checkout-order/${orderId}`;
      itemsToPay = orderFromState ? orderFromState.items : cartItems;
    } else {
      stripeUrl = `http://localhost:5001/api/stripe/checkout-from-cart`;
      itemsToPay = cartItems;

      if (!itemsToPay || itemsToPay.length === 0)
        throw new Error("Panier vide");
    }

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ items: itemsToPay }),
    };

    const response = await fetch(stripeUrl, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Stripe session error");
    }

    const data = await response.json();
    if (!data.url) throw new Error("URL Stripe absente");

    window.location.href = data.url;
  } catch (err) {
    console.error("❌ Stripe error:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  if (paymentMethod !== "paypal") return;

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const merchantId = import.meta.env.VITE_PAYPAL_MERCHANT_ID;

  if (!clientId) {
    setError("PayPal Client ID manquant");
    return;
  }

  const script = document.createElement("script");
  script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&merchant-id=${merchantId}&currency=EUR`;
  script.async = true;

  script.onload = () => {
    window.paypal.Buttons({

   createOrder: async () => {
  const orderId =
    location.state?.orderId || localStorage.getItem("preOrderId");
  const response = await PaymentService.createPayPalOrder(total, orderId);
  console.log("PayPal order created:", response.id); // 🔍 debug
  return response.id; // ✅ OBLIGATOIRE
},

  onApprove: async (data) => {
  const orderId = localStorage.getItem("preOrderId");
  await PaymentService.capturePayPalOrder(data.orderID, orderId);
  await OrderService.finalizeOrder(orderId);  // ✅ finalisation métier
  navigate("/delivery");
  },
      onError: () => {
        setError("Le paiement PayPal a échoué");
      },
    }).render("#paypal-button-container");
  };

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
    const container = document.getElementById("paypal-button-container");
    if (container) container.innerHTML = "";
  };
}, [paymentMethod, total, navigate]);

  const itemsToDisplay = orderFromState ? orderFromState.items : cartItems;

  return (
    <div className="payment-container">
      <CheckoutSteps step={3} />

      <h2>💳 Choisissez votre mode de paiement</h2>
      <div className="payment-options">
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
          />
          Carte bancaire
        </label>

        <label>
          <input
            type="radio"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={() => setPaymentMethod("paypal")}
          />
          PayPal
        </label>
      </div>

      <div className="order-summary">
        <h3>Récapitulatif de la commande</h3>
        <ul>
          {itemsToDisplay.map((item) => (
            <li key={item.variantId || item._id}>
              {item.nom} – {item.options.size} {item.options.unit} ×{" "}
              {item.quantite} ={" "}
              {(
                parseFloat(item.options.prix.toString().replace(",", ".")) *
                item.quantite
              ).toFixed(2)} €
            </li>
          ))}
        </ul>
        <strong>Total : {total.toFixed(2)} €</strong>
      </div>

      {error && <p className="error">{error}</p>}

      {paymentMethod === "paypal" ? (
        <div id="paypal-button-container" />
      ) : (
        <button
          className="pay-btn"
          onClick={handleStripePayment}
          disabled={loading}
        >
          {loading ? "Paiement en cours..." : "Payer maintenant"}
        </button>
      )}
    </div>
  );
}



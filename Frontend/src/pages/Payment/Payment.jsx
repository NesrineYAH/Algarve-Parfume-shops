import React, { useState, useContext, useEffect } from "react";
import "./Payment.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


export default function Payment() {
  const navigate = useNavigate();
  const { cartItems, loading: cartLoading } = useContext(CartContext);
  const cart = cartItems;
//  const cart = cartItems || JSON.parse(localStorage.getItem("cart")) || [];


  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
/*
  useEffect(() => {
      if (cartLoading) return; // ⬅️ on attend
    if (!cart || cart.length === 0) {
       setError("Le panier est vide, impossible de payer.");
       navigate("/cart");
    }
  },  [cart, cartLoading, navigate]);
*/
useEffect(() => {
  if (!order) return;

  if (order.paymentStatus === "paid") {
    navigate("/orders");
  }
}, [order]);

  // 💰 Total
  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.options?.prix || 0) * Number(item.quantite || 1),
    0
  );

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const handleStripePayment = async () => {
  try {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token"); // récupéré du storage ou context

    const response = await fetch(
      "http://localhost:5001/api/stripe/create-checkout-session", // <-- reste la même
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart }),
      }
    );
    if (!response.ok) {
      throw new Error(`Erreur serveur (${response.status})`);
    }
    const data = await response.json();
    if (!data.url) {
      throw new Error("URL Stripe manquante");
    }

    // ✅ Redirection Stripe Checkout
    window.location.href = data.url;

  } catch (err) {
    console.error("❌ Stripe error :", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  /*  PAYPAL */
useEffect(() => {
  if (paymentMethod !== "paypal") return;

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    setError("PayPal client ID manquant");
    return;
  }

  const script = document.createElement("script");
  script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=EUR`;
  script.async = true;

  script.onload = () => {
    if (!window.paypal) return;

    window.paypal
      .Buttons({
        createOrder: (_, actions) => {
          return actions.order.create({
            purchase_units: [
              { amount: { value: total.toFixed(2) } },
            ],
          });
        },
        onApprove: async (_, actions) => {
          await actions.order.capture();
          navigate("/delivery");
        },
        onError: (err) => {
          console.error("PayPal error:", err);
          setError("Le paiement PayPal a échoué.");
        },
      })
      .render("#paypal-button-container");
  };

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
    const container = document.getElementById("paypal-button-container");
    if (container) container.innerHTML = "";
  };
}, [paymentMethod, total, navigate]);



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
          {cart.map((item) => (
            <li key={item.variantId}>
              {item.nom} – {item.options.size} {item.options.unit} ×{" "}
              {item.quantite} ={" "}
              {(item.options.prix * item.quantite).toFixed(2)} €
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

















/*
export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const cart = cartItems || [];
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.options?.prix || 0) * Number(item.quantite || 0),
    0
  );


     const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

  useEffect(() => {
    if (paymentMethod !== "paypal") return;

    const script = document.createElement("script");
    script.src =
  "https://www.paypal.com/sdk/js?client-id&currency=EUR"; 

    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{ amount: { value: total.toFixed(2) } }],
              });
            },
            onApprove: (data, actions) => {
              return actions.order.capture().then((details) => {
                alert(
                  `Paiement PayPal effectué avec succès par ${details.payer.name.given_name}`
                );
                navigate("/confirmation"); 
              });
            },
            onError: (err) => {
              console.error("Erreur PayPal:", err);
              setError("Le paiement PayPal a échoué.");
            },
          })
          .render("#paypal-button-container");
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = "";
    };
  }, [paymentMethod, total, navigate]);

  // Stripe : handler
  const handleStripeCheckout = async () => {
    if (cart.length === 0) {
      setError("Le panier est vide, impossible de payer.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const stripe = await stripePromise;

        const response = await fetch("http://localhost:5001/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) setError(result.error.message);
    } catch (err) {
      console.error("Erreur Stripe:", err);
      setError("Le paiement Stripe a échoué.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const session = await response.json();
    const result = await stripe.redirectToCheckout({ sessionId: session.id });
    if (result.error) alert(result.error.message);
  };
  // Bouton de paiement
  const renderPaymentButton = () => {
    if (paymentMethod === "paypal") {
      return <div id="paypal-button-container"></div>;
    }
    return (
      <button
        onClick={handleStripeCheckout}
        disabled={loading || cart.length === 0}
      >
        {loading ? "Traitement…" : "Payer maintenant"}
      </button>
    );
  };

  return (
    <div className="payment-container">
      <CheckoutSteps step={4} />
      <h2>💳 Choisissez votre mode de paiement</h2>

   <div className="payment-options">
  <label>
    <input
      type="radio"
      value="card"
      checked={paymentMethod === "card"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    Carte bancaire (Stripe)
  </label>

  <label>
    <input
      type="radio"
      value="paypal"
      checked={paymentMethod === "paypal"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    PayPal
  </label>
</div>

      <div className="order-summary">
        <h3>Récapitulatif de votre commande</h3>
        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <ul>
            {cart.map((item) => (
             <li key={`${item.variantId}-${item.options.size}-${item.options.unit}`}>
                {item.nom} – {item.options.size} {item.options.unit} ×{" "}
                {item.quantite} :{" "}
                {(item.options.prix * item.quantite).toFixed(2)} €
              </li>
            ))}
          </ul>
        )}
        <p>
          <strong>Total : {total.toFixed(2)} €</strong>
        </p>
      </div>

      {error && <p className="error">{error}</p>}

      {renderPaymentButton()}
    </div>
  );
}
*/


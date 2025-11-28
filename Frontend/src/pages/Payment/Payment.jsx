import React, { useState, useContext } from "react";
import "./Payment.scss";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Récupérer le panier depuis la navigation, sinon fallback vide
  const cart = location.state?.cart || [];

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    if (cart.length === 0) {
      setError("Le panier est vide, impossible de payer.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulation d'appel backend pour paiement
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Paiement réussi
      alert(`Paiement effectué avec succès via ${paymentMethod}!`);

      // Redirection vers confirmation ou page d'accueil
      navigate("/"); // ou "/confirmation"
    } catch (err) {
      console.error("Erreur paiement :", err);
      setError("Le paiement a échoué. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Calcul total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="payment-container">
      <h2>💳 Choisissez votre mode de paiement</h2>

      <div className="payment-options">
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Carte bancaire
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
              <li key={item.id}>
                {item.name} x {item.quantity} : {item.price * item.quantity} €
              </li>
            ))}
          </ul>
        )}
        <p>
          <strong>Total : {total} €</strong>
        </p>
      </div>

      {error && <p className="error">{error}</p>}

      <button onClick={handlePayment} disabled={loading || cart.length === 0}>
        {loading ? "Traitement…" : "Payer maintenant"}
      </button>
    </div>
  );
}

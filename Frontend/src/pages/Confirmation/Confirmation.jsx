// pages/Confirmation/Confirmation.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Confirmation.scss";

const Confirmation = () => {
  const location = useLocation();

  // Données optionnelles passées via navigate()
  const orderId = location.state?.orderId;
  const email = location.state?.email;

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="icon">✅</div>

        <h1>Merci pour votre commande</h1>

        <p>
          Votre commande a été validée avec succès.
        </p>

        {orderId && (
          <p className="order-id">
            Numéro de commande : <strong>{orderId}</strong>
          </p>
        )}

        {email && (
          <p className="email">
            Un email de confirmation a été envoyé à <strong>{email}</strong>
          </p>
        )}

        <div className="actions">
          <Link to="/" className="btn secondary">
            Retour à l’accueil
          </Link>
          <Link to="/commandes" className="btn primary">
            Mes commandes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

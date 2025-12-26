import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.scss";

export default function Success() {
  const navigate = useNavigate();

  // Optionnel : vider le panier après paiement réussi
  useEffect(() => {
    localStorage.removeItem("cart"); // supprime le panier
    // tu peux aussi vider le contexte si tu utilises CartContext
  }, []);

  return (
    <div className="success-container">
      <h1>🎉 Paiement reçu ✅</h1>
      <p>Merci pour votre commande !</p>
      <button className="btn-home" onClick={() => navigate("/")}>
        Retour à la boutique
      </button>
    </div>
  );
}

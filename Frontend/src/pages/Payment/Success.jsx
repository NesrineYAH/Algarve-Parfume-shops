// success.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./Payment.scss";

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const { refreshUser } = useContext(UserContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");

    // 🔄 Recharge l'utilisateur (cookie HTTP-only)
    refreshUser();

    // 🧹 Vide le panier local
    localStorage.removeItem("cart");

    if (!orderId) return;

    // 🔎 Récupère la commande mise à jour
    fetch(`/api/orders/${orderId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          setOrder(data);
        }
      })
      .catch((err) => console.error("Erreur récupération commande:", err));
  }, [location.search]);

  return (
    <div className="success-container">
      <h1>🎉 Paiement reçu ✅</h1>

      {order && order.totalPrice !== undefined && (
        <strong>
          Votre commande #{order._id} d’un montant de{" "}
          <strong>{order.totalPrice.toFixed(2)} €</strong> a bien été enregistrée.
        </strong>
      )}

      <button className="btn-home" onClick={() => navigate("/")}>
        Retour à la boutique
      </button>
    </div>
  );
}

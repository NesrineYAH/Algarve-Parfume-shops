//success.jsx
/*
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.scss";

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
  const orderId = location.state?.orderId;
  const token = localStorage.getItem("token");
  localStorage.removeItem("cart");

  if (!orderId || !token) return;


  fetch(`http://localhost:5001/api/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((orderData) => setOrder(orderData))
    .catch((err) => console.error("Erreur récupération commande:", err));

  fetch(`http://localhost:5001/api/orders/${orderId}/mark-paid`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => console.log("Commande mise à jour :", data))
    .catch((err) => console.error("Erreur mise à jour commande:", err));
}, [location.state]);

  return (
    <div className="success-container">
      <h1>🎉 Paiement reçu ✅</h1>
      {order && (
        <p>
          Votre commande #{order._id} d’un montant de{" "}
          {order.totalPrice.toFixed(2)} € a bien été enregistrée.
        </p>
      )}
      <button className="btn-home" onClick={() => navigate("/")}>
        Retour à la boutique
      </button>
    </div>
  );
}
*/


import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.scss";

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");
    const token = localStorage.getItem("token");

    localStorage.removeItem("cart");

    if (!orderId || !token) return;

    // Récupérer la commande mise à jour par le webhook Stripe
    fetch(`http://localhost:5001/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((orderData) => setOrder(orderData))
      .catch((err) => console.error("Erreur récupération commande:", err));
  }, [location.search]);

  return (
    <div className="success-container">
      <h1>🎉 Paiement reçu ✅</h1>

      {order && order.totalPrice !== undefined && (
        <p>
          Votre commande #{order._id} d’un montant de{" "}
          {order.totalPrice.toFixed(2)} € a bien été enregistrée.
        </p>
      )}

      <button className="btn-home" onClick={() => navigate("/")}>
        Retour à la boutique
      </button>
    </div>
  );
}

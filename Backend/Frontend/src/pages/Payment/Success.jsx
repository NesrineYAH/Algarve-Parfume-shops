// success.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./Payment.scss";
import { useTranslation } from "react-i18next";


export default function Success() {
  const { t } = useTranslation();
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
      <h1>🎉 {t("Payment.title")} ✅</h1>

      {order && order.totalPrice !== undefined && (
        <strong>
        {t("Payment.textStrongI")} #{order._id} {t("Payment.textStrongII")}{" "}
          <strong>{order.totalPrice.toFixed(2)} €</strong> {t("Payment.textStrongIII")}
        </strong>
      )}

      <button className="btn-home" onClick={() => navigate("/")}>
       {t("Payment.retour")}
      </button>
    </div>
  );
}

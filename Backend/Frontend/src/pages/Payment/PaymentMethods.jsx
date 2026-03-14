// Frontend/src/pages/Payment/PaymentMethods.jsx
import React, { useEffect, useState } from "react";

const PaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Utilisateur non authentifié.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5001/api/payment-methods", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Erreur lors du chargement.");
        }
        return res.json();
      })
      .then((data) => {
        setMethods(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Mes moyens de paiement</h1>

      {methods.length === 0 && (
        <p>Aucun moyen de paiement enregistré.</p>
      )}

      {methods.map((card) => (
        <div
          key={card.id}
          style={{
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ddd",
            borderRadius: "6px",
            maxWidth: "300px",
          }}
        >
          <p>
            💳 {card.brand?.toUpperCase() || "CARTE"} •••• {card.last4}
          </p>
          <p>Expiration : {card.exp_month}/{card.exp_year}</p>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;

















/*
import React, { useEffect, useState } from "react";

const PaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5001/api/payment-methods", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setMethods(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Mes moyens de paiement</h1>

      {Array.isArray(methods) && methods.length === 0 && <p>Aucun moyen de paiement enregistré.</p>}

    {Array.isArray(methods) && methods.map((card) => (
  <div key={card.id}>
    <p>💳 {card.brand.toUpperCase()} •••• {card.last4}</p>
  </div>
))}

    </div>
  );
};

export default PaymentMethods;
*/
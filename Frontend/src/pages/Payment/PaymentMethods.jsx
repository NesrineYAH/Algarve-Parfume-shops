// Frontend/src/pages/Payment/PaymentMethods.jsx
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

      {methods.length === 0 && <p>Aucun moyen de paiement enregistré.</p>}

    {methods.map((card) => (
  <div key={card.id}>
    <p>💳 {card.brand.toUpperCase()} •••• {card.last4}</p>
  </div>
))}

    </div>
  );
};

export default PaymentMethods;

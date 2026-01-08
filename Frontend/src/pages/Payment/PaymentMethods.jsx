import React, { useEffect, useState } from "react";

const PaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => { 
  const token = localStorage.getItem("token");

  fetch("http://localhost:5001/api/payments", { // <-- nouvelle route
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
        <div key={card.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
          <p>
            💳 {card.card.brand.toUpperCase()} •••• {card.card.last4}
          </p>
          <p>
            Expire : {card.card.exp_month}/{card.card.exp_year}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;

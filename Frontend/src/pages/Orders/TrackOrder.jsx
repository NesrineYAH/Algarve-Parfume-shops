import React, { useState } from "react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError("Veuillez entrer un numéro de commande.");
      return;
    }

    setError("");
    setOrderData(null);

    try {
      // Exemple d'appel API (à adapter selon ton backend)
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}`);

      if (!response.ok) {
        throw new Error("Commande introuvable");
      }

      const data = await response.json();
      setOrderData(data);
    } catch (err) {
      setError("Aucune commande trouvée avec ce numéro.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Suivre votre commande</h1>

      <div style={styles.card}>
        <input
          type="text"
          placeholder="Entrez votre numéro de commande"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleTrackOrder} style={styles.button}>
          Suivre la commande
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {orderData && (
          <div style={styles.result}>
            <h3>Commande : {orderData.id}</h3>
            <p><strong>Statut :</strong> {orderData.status}</p>
            <p><strong>Date :</strong> {orderData.date}</p>
            <p><strong>Adresse :</strong> {orderData.address}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    width: "90%",
    maxWidth: 450,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: 16,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  error: {
    marginTop: 15,
    color: "red",
    textAlign: "center",
  },
  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f8ff",
    borderRadius: 6,
  },
};

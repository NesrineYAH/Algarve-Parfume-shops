import React, { useState } from "react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);


  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError("Veuillez entrer un numéro de commande.");
      return;
    }

    setError("");
    setOrderData(null);

    try {
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

  const markAsDelivered = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/orders/${orderData._id}/deliver`,
        { method: "POST", credentials: "include" }
      );

      if (!response.ok) {
        alert("Impossible de marquer la commande comme reçue.");
        return;
      }

      const updated = await response.json();
      setOrderData(updated.order);
      alert("Merci ! Votre commande est marquée comme reçue.");
    } catch (err) {
      alert("Erreur lors de la confirmation de réception.");
    }
  };

  const handleRebuy = (item) => {
    alert(`Produit ajouté au panier : ${item.nom}`);
    // Ici tu peux appeler ton CartService.addToCart()
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
            <h3>Commande : {orderData._id}</h3>

            {/* TIMELINE */}
            <div style={styles.timeline}>
              <div style={orderData.status !== "pending" ? styles.stepActive : styles.step}>
                Préparée
              </div>
              <div style={orderData.status === "confirmed" || orderData.status === "shipped" || orderData.status === "delivered" ? styles.stepActive : styles.step}>
                Confirmée
              </div>
              <div style={orderData.status === "shipped" || orderData.status === "delivered" ? styles.stepActive : styles.step}>
                Expédiée
              </div>
              <div style={orderData.status === "delivered" ? styles.stepActive : styles.step}>
                Livrée
              </div>
            </div>

            <p><strong>Statut :</strong> {orderData.status}</p>
            <p><strong>Paiement :</strong> {orderData.paymentStatus}</p>
            <p><strong>Total :</strong> {orderData.totalPrice} €</p>


            <h4>Détails des articles</h4>

<button
  onClick={() => setShowDetails(!showDetails)}
  style={styles.button}
>
  {showDetails ? "Masquer les détails" : "Afficher les détails"}
</button>


          {showDetails && (
  <div>
    <h4>Détails des articles</h4>
    {orderData.items.map((item, i) => (
      <div key={i} style={styles.item}>
        <p><strong>{item.nom}</strong></p>
        <p>Taille : {item.options.size} {item.options.unit}</p>
        <p>Prix : {item.options.prix} €</p>
        <p>Quantité : {item.quantite}</p>

        <button
          onClick={() => handleRebuy(item)}
          style={styles.smallButton}
        >
          Racheter
        </button>

        <button
          onClick={() => alert("Formulaire d'avis à implémenter")}
          style={styles.smallButton}
        >
          Laisser un avis
        </button>
      </div>
    ))}
  </div>
)}


            {orderData.status !== "delivered" && (
              <button onClick={markAsDelivered} style={styles.button}>
                J’ai reçu ma commande
              </button>
            )}
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
    marginTop: 10,
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
  timeline: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  step: {
    padding: "6px 10px",
    backgroundColor: "#ddd",
    borderRadius: 5,
    fontSize: 12,
  },
  stepActive: {
    padding: "6px 10px",
    backgroundColor: "#4caf50",
    color: "#fff",
    borderRadius: 5,
    fontSize: 12,
  },
  item: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  smallButton: {
    padding: "6px 10px",
    marginRight: 10,
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
  },
};

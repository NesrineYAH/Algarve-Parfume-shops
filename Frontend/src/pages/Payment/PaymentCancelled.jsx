import { Link } from "react-router-dom";

export default function PaymentCancelled() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>❌ Paiement annulé</h1>

        <p style={styles.text}>
          Le paiement n’a pas été finalisé.
        </p>

        <p style={styles.subtext}>
          Aucun montant n’a été débité.  
          Vous pouvez réessayer ou revenir plus tard.
        </p>

        <div style={styles.actions}>
          <Link to="/checkout" style={styles.primaryBtn}>
            Réessayer le paiement
          </Link>

          <Link to="/" style={styles.secondaryBtn}>
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
  },
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    maxWidth: "420px",
    textAlign: "center",
  },
  title: {
    color: "#dc2626",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1.1rem",
    marginBottom: "0.5rem",
  },
  subtext: {
    color: "#6b7280",
    marginBottom: "2rem",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "0.75rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  secondaryBtn: {
    border: "1px solid #d1d5db",
    padding: "0.75rem",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#111827",
  },
};

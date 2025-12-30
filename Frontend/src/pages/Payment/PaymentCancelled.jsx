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

};

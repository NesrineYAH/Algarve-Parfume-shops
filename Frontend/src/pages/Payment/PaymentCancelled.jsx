import { Link } from "react-router-dom";
import './Payment.scss'

export default function PaymentCancelled() {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">❌ Paiement annulé</h1>

        <p className="subtext">
          Le paiement n’a pas été finalisé.
        </p>

        <p className="text">
          Aucun montant n’a été débité.  
          Vous pouvez réessayer ou revenir plus tard.
        </p>

        <div>
          <Link to="/checkout" className="primaryBtn">
            Réessayer le paiement
          </Link>

          <Link to="/Home" className="primaryBtn" >
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

/*
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
    */
import { Link } from "react-router-dom";
import './Payment.scss'
import { useTranslation } from "react-i18next";

export default function PaymentCancelled() {
    const { t } = useTranslation();
  
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">❌ {t("Payment.subtext")}</h1>

        <p className="subtext">
    {t("Payment.subtextPragraphI")}
        </p>

        <p className="text">
    {t("Payment.subtextPragraphII")}
        </p>

        <div>
          <Link to="/checkout" className="primaryBtn">   {t("Payment.primaryBtn")}

          </Link>

          <Link to="/Home" className="primaryBtn" >
             {t("Payment.retour")}
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
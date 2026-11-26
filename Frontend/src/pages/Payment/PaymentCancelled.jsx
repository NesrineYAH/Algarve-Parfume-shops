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


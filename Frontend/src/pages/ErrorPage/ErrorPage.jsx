// src/pages/Error/ErrorPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ErrorPage.scss";
import { useTranslation } from "react-i18next";


export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-card">
        <h1> {t("error.h1")}</h1>
        <h2>{t("error.h2")}</h2>
        <p>
          {t("error.p")}
        </p>

        <div className="error-actions">
          <button onClick={() => navigate(-1)}> ← {t("error.Retour")}</button>

          <Link to="/Home">
            <button className="primary">🏠 {t("error.Accueil")}  
            </button>
          </Link>

          <Link to="/Home">
            <button>  🛍️  {t("error.Boutique")} </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// src/pages/Error/ErrorPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ErrorPage.scss";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-card">
        <h1>404</h1>
        <h2>Oups… Page introuvable</h2>

        <p>
          La page que vous recherchez n’existe pas ou a été déplacée.
        </p>

        <div className="error-actions">
          <button onClick={() => navigate(-1)}>
            ← Retour
          </button>

          <Link to="/Home">
            <button className="primary">
              🏠 Accueil
            </button>
          </Link>

          <Link to="/Home">
            <button>
              🛍️ Boutique
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

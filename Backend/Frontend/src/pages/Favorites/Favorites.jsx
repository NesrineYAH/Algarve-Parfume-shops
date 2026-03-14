// src/pages/Favorites.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Favorites.scss";
import { FavoritesContext } from "../../context/FavoritesContext";
import { useTranslation } from "react-i18next";

export default function Favorites() {
      const { t } = useTranslation();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  // 🔒 Sécurisation
  const safeFavorites = Array.isArray(favorites) ? favorites : [];

  return (
    <div className="favorites">
      <h1>❤️ {t("favorites.h1")} </h1>

      {safeFavorites.length === 0 ? (

              <p>{t("favorites.p")}</p>
      ) : (
        <div className="favorites__grid">
          {safeFavorites.map((product) => (
            <div key={product._id} className="favorites__card">
              <Link to={`/product/${product._id}`}>
                {product.imageUrl ? (
                  <img
                    src={`http://localhost:5001${product.imageUrl}`}
                    alt={product.nom}
                    className="favorites__img"
                  />
                ) : (
                  <div className="favorites__no-image">
                    Image non disponible
                  </div>
                )}
              </Link>

              <div className="product__info">
                <h3>{product.nom}</h3>

                {product.options?.length > 0 && (
                  <p>
                   {t("favorites.minimum")}{" "}
                    <strong>
                      {product.options[0].prix.toFixed(2)} €
                    </strong>
                  </p>
                )}

                <button
                  className="remove-btn"
                  onClick={() => toggleFavorite(product)}
                >
               <button>{t("favorites.button")}</button>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



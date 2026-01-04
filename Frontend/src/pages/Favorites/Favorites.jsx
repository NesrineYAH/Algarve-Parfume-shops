// src/pages/Favorites.jsx
import React, { useState, useEffect } from "react";
import "./Favorites.scss";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // Charger les favoris depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const handleRemove = (id) => {
    const updated = favorites.filter((item) => item._id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="favorites-page">
      <h2>Mes Favoris</h2>
      {favorites.length === 0 ? (
        <p>Vous n’avez aucun produit dans vos favoris.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <div key={product._id} className="favorite-card">
              {product.imageUrl ? (
                <img
                  src={`http://localhost:5001${product.imageUrl}`}
                  alt={product.nom}
                  className="favorite-img"
                />
              ) : (
                <div className="no-image">Image non disponible</div>
              )}
              <div className="product-info">
                <h3>{product.nom}</h3>
                <p>{product.prix} €</p>
         {/* Quantité du parfum */}
                {product.options && product.options.length > 0 && (
                  <p>
                    Quantité :{" "}
                    <strong>
                      {product.options[0].size} {product.options[0].unit}
                    </strong>
                  </p>
                )}
                <button onClick={() => handleRemove(product._id)}>
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

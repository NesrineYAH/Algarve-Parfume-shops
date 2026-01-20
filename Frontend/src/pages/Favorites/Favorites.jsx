// src/pages/Favorites.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Favorites.scss";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔐 Charger les favoris depuis la base de données
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setFavorites([]);
          return;
        }

        const res = await fetch("http://localhost:5001/api/users/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erreur chargement favoris");
        }

        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("❌ Favoris error:", err);
        setError("Impossible de charger les favoris");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // ❌ Supprimer un favori (toggle backend)
  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5001/api/users/favorites/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Erreur suppression favori");
      }

      const updatedFavorites = await res.json();
      setFavorites(updatedFavorites);
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer le favori");
    }
  };

  if (loading) {
    return <p className="favorites__loading">Chargement...</p>;
  }

  return (
    <div className="favorites">
      <h2>❤️ Mes Favoris</h2>

      {error && <p className="error">{error}</p>}

      {favorites.length === 0 ? (
        <p>Vous n’avez aucun produit dans vos favoris.</p>
      ) : (
        <div className="favorites__grid">
          {favorites.map((product) => (
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

                {product.options && product.options.length > 0 && (
                  <p>
                    À partir de{" "}
                    <strong>
                      {product.options[0].prix.toFixed(2)} €
                    </strong>
                  </p>
                )}

                <button
                  className="remove-btn"
                  onClick={() => handleRemove(product._id)}
                >
                  Retirer ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// src/pages/Favorites.jsx
import React, { useState } from "react";
import "./Favorites.scss";

// Exemple de produits (dans la vraie app, tu récupéreras depuis l'API)
const initialProducts = [
  { id: 1, name: "Parfum Rose", price: 45, image: "../../assets/logo/imageWh.jpg" },
  { id: 2, name: "Parfum Jasmin", price: 50, image: "" },
 
];

export default function Favorites() {
  const [favorites, setFavorites] = useState(initialProducts);

  const handleRemove = (id) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <div className="favorites-page">
      <h2>Mes Favoris</h2>
      {favorites.length === 0 ? (
        <p>Vous n’avez aucun produit dans vos favoris.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <div key={product.id} className="favorite-card">
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.price} €</p>
                <button onClick={() => handleRemove(product.id)}>Retirer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

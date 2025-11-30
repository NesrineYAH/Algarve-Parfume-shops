import React, { useState, useEffect } from "react";
import SearchBar from "../../components/searchBar/searchBar.jsx";
import { Link } from "react-router-dom";
import "./Home.scss";
import { Heart } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Fonction panier définie ici
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/products");
        const data = await res.json();
        const prod = Array.isArray(data) ? data : data.products;
        setProducts(prod);
        setFiltered(prod);
      } catch (err) {
        setError("Impossible de récupérer les produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) return setFiltered(products);
    const results = products.filter((p) =>
      (p.nom || "").toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);
  };

  const toggleFavorite = (product) => {
    let updated;
    if (favorites.some((fav) => fav._id === product._id)) {
      updated = favorites.filter((fav) => fav._id !== product._id);
    } else {
      updated = [...favorites, product];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home">
      <h2>Nos Produits</h2>
      <SearchBar onSearch={handleSearch} className="searchBar" />
      <div className="grid">
        {filtered.map((product) => (
          <div key={product._id} className="card">
            {/* Icône cœur */}
            <div
              className="card__favorite"
              onClick={() => toggleFavorite(product)}
            >
              <Heart
                className={`icone ${
                  favorites.some((fav) => fav._id === product._id)
                    ? "active"
                    : "red"
                }`}
              />
            </div>

            {/* Image + infos cliquables */}
            <Link to={`/product/${product._id}`} className="card__content">
              {product.imageUrl && (
                <img
                  src={`http://localhost:5001${product.imageUrl}`}
                  alt={product.nom}
                  className="card_img"
                />
              )}
              <h3>{product.nom}</h3>
              <p>{product.prix} €</p>
              <p>{product.stock} en stock</p>
            </Link>

            {/* Bouton panier 
            <button className="btn-Add" onClick={() => addToCart(product)}>
              Ajouter au panier
            </button>
*/}
            <Link to={`/product/${product._id}`}>
              <button>Ajouter au panier</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

/*
- Les Hooks → toujours en haut du composant, avant tout return.
- Les fonctions utilitaires (addToCart, toggleFavorite, etc.) → tu peux les mettre avant ou après les useEffect, tant qu’elles sont définies avant leur utilisation dans le return.
👉 Donc tu peux mettre addToCart juste après tes useState, avant ou après ton useEffect, ça ne change rien.


*/

/*
  <div className="grid">
        {filtered.map((product) => (
          <div key={product._id} className="card">

            <div className="card__favorite">
              <Link to="/Favorites">
                <Heart className="icone" />
              </Link>
            </div>

      
            <Link to={`/product/${product._id}`} className="card__content">
              {product.imageUrl && (
                <img
                  src={`http://localhost:5001${product.imageUrl}`}
                  alt={product.nom}
                  className="card_img"
                />
              )}
              <h3>{product.nom}</h3>
              <p>{product.prix} €</p>
              <p>{product.stock} en stock</p>
            </Link>

            <button className="btn">Ajouter au panier</button>
          </div>
        ))}
      </div>

*/

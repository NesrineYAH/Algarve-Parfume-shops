import React, { useState, useEffect } from "react";
import SearchBar from "../../components/searchBar/searchBar.jsx";
import { Link } from "react-router-dom";
import "./Home.scss";
import { Heart } from "lucide-react";
import { useLocation } from "react-router-dom"
import { getProductsByGenre, getAllProducts } from "../../Services/productService";


const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

 const location = useLocation();
 const [ratings, setRatings] = useState({});
// pour stocker les commentaires par produit


useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/products");
      const data = await res.json();
      const prod = Array.isArray(data) ? data : data.products;

      setProducts(prod);

      // 🔥 récupération du genre depuis l’URL
      const params = new URLSearchParams(location.search);
      const genre = params.get("genre");

      // 🔥 filtrage
      if (genre) {
        const filteredByGenre = prod.filter(
          (p) => p.genre?.toLowerCase() === genre.toLowerCase()
        );
        setFiltered(filteredByGenre);
      } else {
        setFiltered(prod);
      }
    } catch (err) {
      setError("Impossible de récupérer les produits.");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [location.search]);


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

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/products");
      const data = await res.json();
      const prod = Array.isArray(data) ? data : data.products;

      setProducts(prod);
      fetchRatings(prod);
    
      const params = new URLSearchParams(location.search);
      const genre = params.get("genre");

      if (genre) {
        const filteredByGenre = prod.filter(
          (p) => p.genre?.toLowerCase() === genre.toLowerCase()
        );
        setFiltered(filteredByGenre);
      } else {
        setFiltered(prod);
      }
    } catch (err) {
      setError("Impossible de récupérer les produits.");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [location.search]);


// 🔥 Fonction pour récupérer les commentaires
const fetchRatings = async (productsList) => {
  const allRatings = {};

  for (const p of productsList) {
    try {
      const res = await fetch(`http://localhost:5001/api/products/${p._id}/comments`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const avg =
          data.reduce((sum, c) => sum + (c.rating || 0), 0) / data.length;

        allRatings[p._id] = avg;
      } else {
        allRatings[p._id] = 0;
      }
    } catch (err) {
      allRatings[p._id] = 0;
    }
  }

  setRatings(allRatings);
};


  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home">
          {/*    <h2>Nos Produits</h2> */}
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
   
            <Link to={`/product/${product._id}`} className="card__content">
              {product.imageUrl && (
                <img
                  src={`http://localhost:5001${product.imageUrl}`}
                  alt={product.nom}
                  className="card_img"
                />
              )}
              <h3>{product.nom}</h3>
              <p>{product.stock} en stock</p>
<p> à partir de {Math.min(...product.options.map(o => o.prix))} € </p>

            </Link>
{/* <p>à partir de {product.options[0].prix} €</p>*/}
<div className="rating">
  ⭐ {ratings[product._id] === 0
        ? "0"
        : ratings[product._id]?.toFixed(1)}
</div>

{/*}  <div className="rating">
  ⭐ {ratings[product._id]?.toFixed(1) || "0"} 
</div> 


// arrondir à 1 décimale ou afficher 0 si pas de note
<div className="rating">
  ⭐ {Number.isInteger(ratings[product._id])
        ? ratings[product._id]
        : ratings[product._id]?.toFixed(1)}
</div>

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
*/
  
/*
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
*/


/*
- Les Hooks → toujours en haut du composant, avant tout return.
- Les fonctions utilitaires (addToCart, toggleFavorite, etc.) → tu peux les mettre avant ou après les useEffect, tant qu’elles sont définies avant leur utilisation dans le return.
👉 Donc tu peux mettre addToCart juste après tes useState, avant ou après ton useEffect, ça ne change rien.
👉 toFixed(1) force toujours un chiffre après la virgule, même si la valeur est 0.

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

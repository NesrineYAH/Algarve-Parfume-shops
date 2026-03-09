import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../../components/searchBar/searchBar.jsx";
import { Link, useLocation } from "react-router-dom";
import "./Home.scss";
import { Heart } from "lucide-react";
import { FavoritesContext } from "../../context/FavoritesContext";
import StarRating from "../../components/StarRating/StarRating";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const [visibleProducts, setVisibleProducts] = useState(8);

  // récupérer les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/products");
        const data = await res.json();

        const prod = Array.isArray(data) ? data : data.products;

        setProducts(prod);

        const params = new URLSearchParams(location.search);
        const genre = params.get("genre");

        if (genre) {
          const filteredByGenre = prod.filter(
            (p) => p.genre?.toLowerCase() === genre.toLowerCase()
          );
          setFiltered(filteredByGenre);
          fetchRatings(filteredByGenre);
        } else {
          setFiltered(prod);
          fetchRatings(prod);
        }
      } catch (err) {
        setError("Impossible de récupérer les produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  // récupérer les notes
  const fetchRatings = async (list) => {
    const allRatings = {};

    for (const product of list) {
      try {
        const res = await fetch(
          `http://localhost:5001/api/products/${product._id}/comments`
        );

        const data = await res.json();

        const average =
          data.length > 0
            ? data.reduce((sum, c) => sum + (c.rating || 0), 0) / data.length
            : 0;

        allRatings[product._id] = {
          average,
          count: data.length,
        };
      } catch {
        allRatings[product._id] = {
          average: 0,
          count: 0,
        };
      }
    }

    setRatings(allRatings);
  };

  // recherche
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFiltered(products);
      return;
    }

    const results = products.filter((p) =>
      (p.nom || "").toLowerCase().includes(query.toLowerCase())
    );

    setFiltered(results);
  };

  if (loading) return <p>{t("home.textChargement")}</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home">
      <SearchBar onSearch={handleSearch} />

     <div className="grid">
  {filtered.slice(0, visibleProducts).map((product) => {
    const isFavorite =
      Array.isArray(favorites) &&
      favorites.some((fav) => fav._id === product._id);

    return (
      <div key={product._id} className="card">
        
        {/* FAVORIS */}
        <div
          className="card__favorite"
          onClick={() => toggleFavorite(product)}
        >
          <Heart className={`icone ${isFavorite ? "active" : ""}`} />
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

          <p>
            {t("home.textPrix")}{" "}
            {Math.min(...product.options.map((o) => o.prix))} €
          </p>
        </Link>

        {/* étoiles */}
        <div className="rating">
          <StarRating
            rating={Math.round(ratings[product._id]?.average || 0)}
          />
          <span className="rating-count">
            ({ratings[product._id]?.count || 0})
          </span>
        </div>

        <Link to={`/product/${product._id}`}>
          <button>{t("home.AddCart")}</button>
        </Link>

      </div>
    );
  })}
</div>

      {visibleProducts < filtered.length && (
  <div className="load-more">
    <button onClick={() => setVisibleProducts(visibleProducts + 8)}>
   {t("home.plus")}
    </button>
  </div>
)}
    </div>
  );
};

export default Home;





















/*

import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../../components/searchBar/searchBar.jsx";
import { Link } from "react-router-dom";
import "./Home.scss";
import { Heart } from "lucide-react";
import { useLocation } from "react-router-dom"
import { getProductsByGenre, getAllProducts } from "../../Services/productService";
import { FavoritesContext } from "../../context/FavoritesContext";
import StarRating from "../../components/StarRating/StarRating"; 
import { useTranslation } from "react-i18next";



const Home = () => {
  const { t } = useTranslation();
const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 const location = useLocation();
 const [ratings, setRatings] = useState({});
  const [product, setProduct] = useState([]);
  
const isFavorite =
  Array.isArray(favorites) &&
  favorites.some((fav) => fav._id === product._id);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/products");
      const data = await res.json();
      const prod = Array.isArray(data) ? data : data.products;

      setProducts(prod);

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

  const handleSearch = (query) => {
    if (!query.trim()) return setFiltered(products);
    const results = products.filter((p) =>
      (p.nom || "").toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);
  };

const fetchRatings = async (list) => {
  const all = {};

  for (const p of list) {
    try {
      const res = await fetch(
        `http://localhost:5001/api/products/${p._id}/comments`
      );
      const data = await res.json();

      const average =
        data.length > 0
          ? data.reduce((sum, c) => sum + (c.rating || 0), 0) / data.length
          : 0;

      all[p._id] = {
        average,
        count: data.length,
      };
    } catch {
      all[p._id] = {
        average: 0,
        count: 0,
      };
    }
  }

  setRatings(all);
};

  const [comments, setComments] = useState([]);
    const averageRating =
    comments.length > 0
      ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
      : 0;

  if (loading) return <p>{t("home.textChargement")}</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home">
      <SearchBar onSearch={handleSearch} />
      <div className="grid">
        {filtered.map((product) => (
          <div key={product._id} className="card">
         
            <div
              className="card__favorite"
              onClick={() => toggleFavorite(product)}
            >
              <Heart
            className={`icone ${isFavorite ? "active" : "red"}`} />
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
            
<p> {t("home.textPrix")} {Math.min(...product.options.map(o => o.prix))} € </p>


            </Link>

 <StarRating rating={Math.round(ratings[product._id] || 0)} />
<br /> 
            <Link to={`/product/${product._id}`}>
              <button>{t("home.AddCart")}</button>
       
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

*/

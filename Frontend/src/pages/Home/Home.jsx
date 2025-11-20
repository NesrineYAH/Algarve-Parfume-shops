import React, { useState, useEffect } from "react";
import SearchBar from "../../components/searchBar/searchBar.jsx";
import { useNavigate, Link } from "react-router-dom";
import "./Home.scss";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // Récupération des produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/products");
        const data = await res.json();

        const prod = data.products || data;

        setProducts(prod);
        setFiltered(prod);
      } catch (err) {
        console.error("Erreur fetch:", err);
        setError("Impossible de récupérer les produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p className="error">{error}</p>;

  // Fonction de recherche
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

  return (
    <div className="home">
      <h2>Nos Produits</h2>

      <SearchBar onSearch={handleSearch} className="searchBar" />

      <div className="grid">
        {filtered.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="card"
          >
            <img
              src={`http://localhost:5001${product.imageUrl}`}
              alt={product.img}
              className="card_img"
            />

            <h3>{product.nom}</h3>
            <p>{product.prix} €</p>
            <p>{product.stock} en stock</p>

            <button className="btn">Ajouter au panier</button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

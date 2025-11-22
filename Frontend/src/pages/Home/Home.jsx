import React, { useState, useEffect } from "react";
import SearchBar from "../../components/searchBar/searchBar.jsx";
import { Link } from "react-router-dom";
import "./Home.scss";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/products");
        const data = await res.json();
        console.log("Data API:", data);

        const prod = Array.isArray(data) ? data : data.products;
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

  const handleSearch = (query) => {
    if (!query.trim()) return setFiltered(products);

    const results = products.filter((p) =>
      (p.nom || "").toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);
  };

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p className="error">{error}</p>;

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
            <button className="btn">Ajouter au panier</button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

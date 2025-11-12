import React, { useState, useEffect } from "react";
import SearchBar from "../../components/searchBar/searchBar.jsx";
import { useNavigate, Link } from "react-router-dom";
import "./Home.scss";
import Product from "../Product/Product.jsx";
import AdminAddProduct from "../AdminAddProducts/AdminAddProduct.jsx";



const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();
   const [loading, setLoading] = useState(true); //12/11
     const [error, setError] = useState(""); //12/11
  
  
   const role = localStorage.getItem("role");
  // Récupération des produits depuis l'API
 useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/products");
      const data = await res.json();
      console.log("Data from API:", data);
        console.log("Type:", Array.isArray(data), "Length:", data.length);
      setProducts(data.products || data); // selon ce que renvoie le backend
      setFiltered(data.products || data);
    } catch (err) {
      console.error("Erreur lors du fetch des produits:", err);
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
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);
    console.log("Filtered products:", filtered);
  };

  // Redirection vers la page produit
  const handleClickProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="home">
      <h2>Nos Produits</h2>
{/* Bouton réservé aux admin/vendeur */}
      {(role === "admin" || role === "vendeur") && (
        <div className="admin-action">
          <Link to="/admin/add-product" className="btn-add">
            ➕ Ajouter un produit
          </Link>
        </div>
      )}



      <SearchBar onSearch={handleSearch} className="searchBar" />




      <div className="grid">

        {filtered.map((product) => (
                  <Link to={`/product/${product._id}`}>
          <div
            key={product._id}
            className="card"
            onClick={() => handleClickProduct(product._id)}
          >
             <img
        src={`http://localhost:5001${product.imageUrl}`} 
        alt={product.image}
        className="card_img"
      />
            <h3>{product.nom}</h3>
            <p>{product.prix} €</p>
             <p>{product.stock} En Stock / Expédition Immédiate</p>

            

  <button className="btn">Ajouter au panier</button>
          </div>
                  </Link>
        ))}
      </div>
  

    </div>
    
    
  );
  
};

export default Home;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Product.scss';

const Product = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Produit introuvable ou erreur serveur.");
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Chargement du produit...</p>;


return (
    <section id="page">
      <img src={`http://localhost:5001${product.imageUrl}`} alt={product.nom} style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
<div className="product-container">
      <h2>{product.nom}</h2>
      

      <p><strong>Prix :</strong> {product.prix} €</p>
      <p><strong>Stock :</strong> {product.stock} en stock</p>    
      <p><strong>Description :</strong> {product.description}</p>
      <br />
           <button>Ajouter au panier</button>
    </div>
    </section>
  );
};

export default Product;

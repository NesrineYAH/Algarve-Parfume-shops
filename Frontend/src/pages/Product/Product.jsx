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
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>{product.nom}</h2>
      <img src={`http://localhost:5001${product.imageUrl}`} alt={product.nom} style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
      <p><strong>Description :</strong> {product.description}</p>
      <p><strong>Prix :</strong> {product.prix} €</p>
      <p><strong>Stock :</strong> {product.stock} en stock</p>
      <button>Ajouter au panier</button>
      <p>Une eau de toilette unique et originale inspirée par l'atmosphère particulière de la région de l'Algarve, tout au sud du Portugal. Un parfum envoutant à base de d'essence de fleurs d'oranger et d'orange.</p>
    </div>
  );
};

export default Product;

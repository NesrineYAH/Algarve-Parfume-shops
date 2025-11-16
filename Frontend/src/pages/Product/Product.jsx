import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminAddProduct from "../AdminAddProducts/AdminAddProduct";
import"./Product.scss";


const Product = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  
   const role = localStorage.getItem("role"); // récupère le rôle de l'utilisateur

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
    <div className="product-container">
      <div className="pr">
            <img src={`http://localhost:5001${product.imageUrl}`} alt={product.nom}  className="product-image" />
      <h2>{product.nom}</h2>
      <p><strong>Prix :</strong> {product.prix} €</p>
      <p><strong>Stock :</strong> {product.stock} en stock</p>    
      <p> {product.description}</p>
       <br />
  </div>
  {/* ⭐ Notation du produit  12/11*/}
        <div className="rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < product.rating ? "star filled" : "star"}>
                  ★
                </span>
              ))}
              <span className="rating-value">
                {product.rating ? `${product.rating.toFixed(1)}/5` : "Aucune note"}
              </span>
        </div>
           <div className="Commentaires">
           {/* 💬 Commentaires  12/11*/}
            {product.comments && product.comments.length > 0 ? (
              <div className="comments">
                <h4>Commentaires :</h4>
                <ul>
                  {product.comments.map((comment, index) => (
                    <li key={index}>
                      <strong>{comment.user}</strong> : {comment.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="no-comments">Pas encore de commentaires.</p>
            )}
       </div>
           <button className="btn-Add">Ajouter au panier</button>
    </div>
    <div>
  {/* ✅ Bouton visible uniquement pour les admins et vendeurs */}
      {(role === "admin" || role === "vendeur") && (
        <div className="admin-action">
          <Link to="AdminAddProduct" className="btn-Add">
            ➕ Ajouter un prodct 
          </Link>
        </div>
      )}

      {/* ici ton affichage de produits */}
    </div>
    </section>
  );
};

export default Product;

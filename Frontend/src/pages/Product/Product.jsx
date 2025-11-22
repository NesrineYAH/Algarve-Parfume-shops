import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // ⬅️ IMPORTANT !
import axios from "axios";
import "./Product.scss";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        setError("Produit introuvable ou erreur serveur.");
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Chargement du produit...</p>;

  //20/11
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("Cart")) || [];

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <section id="page">
      <div className="product-container">
        <div className="pr">
          <img
            src={`http://localhost:5001${product.imageUrl}`}
            alt={product.nom}
            className="product-image"
          />
          <h2>{product.nom}</h2>
          <p>
            <strong>Prix :</strong> {product.prix} €
          </p>
          <p>
            <strong>Stock :</strong> {product.stock} en stock
          </p>
          <p>{product.description}</p>
        </div>

        {/* ⭐ Notation */}
        <div className="rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < product.rating ? "star filled" : "star"}
            >
              ★
            </span>
          ))}
          <span className="rating-value">
            {product.rating ? `${product.rating.toFixed(1)}/5` : "Aucune note"}
          </span>
        </div>

        {/* 💬 Commentaires */}
        <div className="Commentaires">
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

        <button className="btn-Add" onClick={() => addToCart(product)}>
          Ajouter au panier
        </button>
      </div>

      {/* Bouton Admin / Vendeur */}
      {(role === "admin" || role === "vendeur") && (
        <div className="admin-action">
          <Link to="/admin/add-product" className="btn-Add">
            ➕ Ajouter un produit
          </Link>
          <Link to="/admin/EditProduct" className="btn-Add">
            ➕ modifier un produit
          </Link>
          <Link to="/admin/AdminProductManagement" className="btn-Add">
            ➕ supprimer un produit
          </Link>
        </div>
      )}
    </section>
  );
};

export default Product;

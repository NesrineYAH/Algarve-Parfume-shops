import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Product.scss";
import { useTranslation } from "react-i18next";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null); // option choisie
  const role = localStorage.getItem("role");
  const { t } = useTranslation();
  //03/12
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // 🔥 état du modal

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/products/${id}`
        );
        setProduct(response.data);
        if (response.data.options && response.data.options.length > 0) {
          setSelectedOption(response.data.options[0]); // première option par défaut
        }
      } catch (err) {
        setError("Produit introuvable ou erreur serveur.");
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <p>{t("product.error")} </p>;
  if (!product) return <p>{t("product.loading")} </p>;
/**/

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!selectedOption) {
      alert("Veuillez sélectionner une option.");
      return;
    }

    const selectedSize = selectedOption.size;
    const variantId = `${product._id}-${selectedSize}`;
    const existing = cart.find((item) => item.variantId === variantId);

    if (existing) {
      existing.quantite += 1;
    } else {
      cart.push({
        productId: product._id,
        variantId: variantId, // clé unique 🔥
        nom: product.nom,
        imageUrl: product.imageUrl,
        quantite: 1,
        options: {
          size: selectedOption.size,
          unit: selectedOption.unit,
          prix: selectedOption.prix,
        },
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    // alert("Produit ajouté au panier !");
    setShowModal(true); // 🔥 ouvre le modal
  };
  const ratingValue = Number(product?.rating) || 0;
console.log("PRODUCT:", product);
console.log("RATING:", product?.rating, typeof product?.rating);

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

     <strong>{t("product.stock")} :</strong> {product.stock} {t("product.inStock")}
  </p>
  <p>{product.description}</p>

  {product.options && product.options.length > 0 && (
    <div className="product-options">
<label>{t("product.chooseOption")}</label>
      <select
        value={
          selectedOption
            ? product.options.indexOf(selectedOption)
            : "" // valeur vide si rien n'est sélectionné
        }
        onChange={(e) =>
          setSelectedOption(product.options[e.target.value])
        }
      >
        {/* Option par défaut */}
        <option value="" disabled>
  {t("product.selectSize")}
        </option>

        {product.options.map((opt, index) => (
          <option key={index} value={index}>
            {opt.size} {opt.unit} - {opt.prix} €
          </option>
        ))}
      </select>

      <p>
  <strong>{t("product.selectedPrice")} :</strong>{" "}
        {selectedOption ? selectedOption.prix : 0} €
      </p>
    </div>
  )}
</div>


   
{/* ⭐ Notation */}
<div className="rating">
  {Array.from({ length: 5 }).map((_, i) => (
    
    <span
      key={i}
      className={i < Math.round(ratingValue) ? "star filled" : "star"}
    >
      ★
    </span>
  ))}

  <span className="rating-value">
    {ratingValue > 0
      ? `${ratingValue.toFixed(1)}/5`
      : t("product.noRating")}
  </span>
</div>

        {/* 💬 Commentaires */}
        <div className="Commentaires">
          {product.comments && product.comments.length > 0 ? (
            <div className="comments">
          <h4>{t("product.comments")} :</h4>
              <ul>
                {product.comments.map((comment, index) => (
                  <li key={index}>
                    <strong>{comment.user}</strong> : {comment.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : (

            
<p className="no-comments"> {t("product.noComments")}</p>
          )}
        </div>

        <button className="btn-Add" onClick={addToCart}>
 {t("product.addToCart")}
        </button>
      </div>
      {/* 🔥 MODAL  03/12/2025*/}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3> {t("product.addedTitle")}🎉</h3>
            <p>{t("product.addedMessage")}</p>
            <div className="modal-actions">
              <button onClick={() => navigate("/cart")} className="btn-Add">
              {t("product.viewCart")}
              </button>
              <button onClick={() => navigate("/home")} className="btn-Add">
           {t("product.continueShopping")}
              </button>
            </div>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Bouton Admin / Vendeur */}
      {(role === "admin" || role === "vendeur") && (
        <div className="admin-action">
          <Link to="/admin/add-product" className="btn-Add">
            ➕  {t("product.addProduct")}
          </Link>

          <Link to={`/admin/EditProduct/${product._id}`} className="btn-Add">{t("product.edit")}</Link>

          <Link to="/admin/AdminProductManagement" className="btn-Add">
            ➕   {t("product.delete")}
          </Link>
        </div>
      )}
    </section>
  );
};

export default Product;


     {/* ⭐ Notation 
        <div className="rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < (product.rating || 0) ? "star filled" : "star"}
            >
              ★
            </span>
          ))}
          <span className="rating-value">
            {product.rating     ? `${product.rating.toFixed(1)}/5`: t("product.noRating")}
          </span>
        </div>
        */}


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
  const [showModal, setShowModal] = useState(false); 
  const [hoverRating, setHoverRating] = useState(0); // pour le survol
const [userRating, setUserRating] = useState(0);   // pour la note choisie
//15/12
const [commentText, setCommentText] = useState("");
const [commentLoading, setCommentLoading] = useState(false);
const [commentError, setCommentError] = useState("");


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
//15/12
useEffect(() => {
  if (product?.rating) {
    setUserRating(Number(product.rating));
  }
}, [product]);
//15/12
const submitComment = async () => {
  if (!userRating) {
    setCommentError(t("product.selectRating"));
    return;
  }

  if (!commentText.trim()) {
    setCommentError(t("product.writeComment"));
    return;
  }

  try {
    setCommentLoading(true);
    setCommentError("");

    const token = localStorage.getItem("token");

    const response = await axios.post(
      `http://localhost:5001/api/products/${id}/comment`,
      {
        rating: userRating,
        text: commentText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🔄 mettre à jour le produit avec la réponse backend
    setProduct(response.data.product);

    // reset formulaire
 //   setUserRating(0); 15/12 à 11h12
    setHoverRating(0);
    setCommentText("");
  } catch (err) {
    setCommentError(t("product.commentError"));
    console.error(err);
  } finally {
    setCommentLoading(false);
  }
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

      {/* Déplacer le formaulaire de commentaire   03/12/2025*/}
            {/* 🔹 Formulaire commentaire */}
              <div className="comment-form">
                <h4>{t("product.addComment")}</h4>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t("product.commentPlaceholder")}
                  className="comment-textarea"
                />
                {commentError && <p className="error">{commentError}</p>}
                <button className="btn-Add" onClick={submitComment} disabled={commentLoading}>
                  {commentLoading ? t("product.sending") : t("product.sendComment")}
                </button>
              </div>
      
              {/* 15/12 à 13h00  comment comme mariaunod */}
              <div className="review-summary">
              {/* <h3>{t("product.reviewsTitle")}</h3> */}  
                <h3>Note et avis</h3>
                 <p className="average-rating">
                 {product.rating.toFixed(1)} / 5 ⭐ ({product.comments.length})
                 {/*  {t("product.reviewsCount")}) */}  
                  </p>
      
        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = product.comments.filter(c => c.rating === star).length;
            return (
              <div key={star} className="rating-row">
                <span>{star} ★</span>
                <progress value={count} max={product.comments.length}></progress>
                <span>{count}</span>
              </div>
            );
          })}
        </div>
              </div>
              











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

/*
<div className="rating">
  {Array.from({ length: 5 }).map((_, i) => {
    const starValue = i + 1;

    return (
      <span
        key={i}
        className={
          starValue <= (hoverRating || userRating) ? "star filled" : "star"
        }
        onMouseEnter={() => setHoverRating(starValue)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => setUserRating(starValue)}
        style={{ cursor: "pointer" }}>★ </span>
      );
  })}

  <span className="rating-value">
    {product.rating > 0 ? `${product.rating.toFixed(1)}/5` : t("product.noRating")}
  </span>
</div>

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
        <div className="comment-form">
  <h4>{t("product.addComment")}</h4>

  <textarea
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    placeholder={t("product.commentPlaceholder")}
    className="comment-textarea"
  />

  {commentError && <p className="error">{commentError}</p>}

  <button
    className="btn-Add"
    onClick={submitComment}
    disabled={commentLoading}
  >
    {commentLoading
      ? t("product.sending")
      : t("product.sendComment")}
  </button>
</div>


*/
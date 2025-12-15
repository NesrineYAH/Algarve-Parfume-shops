import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Product.scss";
import { useTranslation } from "react-i18next";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const role = localStorage.getItem("role");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(0);

  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

  // 🔹 Récupération du produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/products/${id}`
        );
        setProduct(response.data);

{/*}
        if (response.data.options && response.data.options.length > 0) {
          setSelectedOption(response.data.options[0]);
        }
*/}
     // ✅ On garde selectedOption = null
      setSelectedOption(null);
        // initialisation rating
        if (response.data.rating) {
          setUserRating(Number(response.data.rating));
        }

      } catch (err) {
        setError("Produit introuvable ou erreur serveur.");
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <p>{t("product.error")}</p>;
  if (!product) return <p>{t("product.loading")}</p>;

  // 🔹 Ajouter au panier
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!selectedOption) {
      alert("Veuillez sélectionner une option.");
      return;
    }

    const variantId = `${product._id}-${selectedOption.size}`;
    const existing = cart.find((item) => item.variantId === variantId);

    if (existing) {
      existing.quantite += 1;
    } else {
      cart.push({
        productId: product._id,
        variantId,
        nom: product.nom,
        imageUrl: product.imageUrl,
        quantite: 1,
        options: selectedOption,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setShowModal(true);
  };

  // 🔹 Soumettre commentaire
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
        { rating: userRating, text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProduct(response.data.product);
      setHoverRating(0);
      setCommentText("");
      // userRating reste pour afficher les étoiles
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
      //       <div className="product-options">
      //         <label>{t("product.chooseOption")}</label>
      //  <select
      //       value={selectedOption ? product.options.indexOf(selectedOption) : ""}
      //         onChange={(e) => setSelectedOption(product.options[e.target.value])}
      //      >
      //  <option value="" > {t("product.selectSize")}    </option>  {/* "Sélectionner une taille" */}
     
      //    {product.options.map((opt, index) => (
      //    <option key={index} value={index}>
      //      {opt.size} {opt.unit} - {opt.prix} €
      //      </option>
      //          ))}
      //           </select>

      //         <p>
      //           <strong>{t("product.selectedPrice")} :</strong>{" "}
      //           {selectedOption ? selectedOption.prix : 0} €
      //         </p>
      //       </div>
      <div className="product-options">
  <label>{t("product.chooseOption")}</label>
  <select
    value={selectedOption ? selectedOption.size : ""}
    onChange={(e) => {
      const selected = product.options.find(
        (opt) => opt.size.toString() === e.target.value
      );
      setSelectedOption(selected);
    }}
  >
    {/* Placeholder */}
    <option value="">
      {t("product.selectSize")} {/* "Sélectionner une taille" */}
    </option>

    {/* Options réelles */}
    {product.options.map((opt, index) => (
      <option key={index} value={opt.size}>
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

        {/* ⭐ Rating */}
        <div className="rating">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <span
                key={i}
                className={starValue <= (hoverRating || userRating) ? "star filled" : "star"}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setUserRating(starValue)}
                style={{ cursor: "pointer" }}
              >
                ★
              </span>
            );
          })}
          <span className="rating-value">
            {product.rating > 0 ? `${product.rating.toFixed(1)}/5` : t("product.noRating")}
          </span>
        </div>

        <button className="btn-Add" onClick={addToCart}>
          {t("product.addToCart")}
        </button>
        

        {/* 🔹 Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{t("product.addedTitle")}🎉</h3>
              <p>{t("product.addedMessage")}</p>
              <div className="modal-actions">
                <button onClick={() => navigate("/cart")} className="btn-Add">
                  {t("product.viewCart")}
                </button>
                <button onClick={() => navigate("/home")} className="btn-Add">
                  {t("product.continueShopping")}
                </button>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✖</button>
            </div>
          </div>
        )}

{/* rating +comment+formulaire coemmentaire */} 


        {/* 🔹 Commentaires */}
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
            <p className="no-comments">{t("product.noComments")}</p>
          )}
        </div>

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

        {/* 🔹 Admin */}
        {(role === "admin" || role === "vendeur") && (
          <div className="admin-action">
            <Link to="/admin/add-product" className="btn-Add">➕ {t("product.addProduct")}</Link>
            <Link to={`/admin/EditProduct/${product._id}`} className="btn-Add">{t("product.edit")}</Link>
            <Link to="/admin/AdminProductManagement" className="btn-Add">➕ {t("product.delete")}</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Product;



/*
Uncaught Error: Rendered more hooks than during the previous render
vient souvent de l’usage de hooks de manière conditionnelle, ou de modifications qui provoquent un rendu différent côté React.
*/
{/* ⭐ Notation 
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
*/}

  

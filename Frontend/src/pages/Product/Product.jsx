import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Product.scss";
import { useTranslation } from "react-i18next";


const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
    const { t } = useTranslation();
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(0);

  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");


  const [comments, setComments] = useState([]);

  // 🔹 Récupération du produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/products/${id}`
        );
        setProduct(response.data);
        setSelectedOption(null);

        if (response.data.rating) {
          setUserRating(Number(response.data.rating));
        }
      } catch (err) {
        setError("Produit introuvable ou erreur serveur.");
      }
    };

    fetchProduct();
  }, [id]);

  // 🔹 Récupération des commentaires
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/products/${id}/comments`
        );
        setComments(res.data);
      } catch (err) {
        console.error("Erreur récupération commentaires", err);
      }
    };

    fetchComments();
  }, [id]);

 

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
  const reportComment = async (commentId) => {
  try {
    const token = localStorage.getItem("token"); // 🔥 Manquait !

    if (!token) {
      alert("Vous devez être connecté pour signaler un commentaire.");
      return;
    }

    await axios.post(
      `http://localhost:5001/api/comments/${id}/report`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Commentaire signalé !");
  } catch (err) {
    console.error("Erreur lors du signalement :", err);
    alert("Impossible de signaler ce commentaire.");
  }
};


   // 🔹 Rendu conditionnel APRÈS les hooks
  if (error) return <p>{t("product.error")}</p>;
  if (!product) return <p>{t("product.loading")}</p>;
  
const likeComment = async (commentId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:5001/api/comments/${commentId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? res.data : c))
    );
  } catch (err) {
    console.error(err);
  }
};

const dislikeComment = async (commentId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:5001/api/comments/${commentId}/dislike`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? res.data : c))
    );
  } catch (err) {
    console.error(err);
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
            <strong>{t("product.stock")} :</strong> {product.stock}{" "}
            {t("product.inStock")}
          </p>
          <p>{product.description}</p>

          {/* Options */}
          {product.options && product.options.length > 0 && (
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
                <option value="">{t("product.selectSize")}</option>

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
                className={
                  starValue <= (hoverRating || userRating)
                    ? "star filled"
                    : "star"
                }
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
            {product.rating > 0
              ? `${product.rating.toFixed(1)}/5`
              : t("product.noRating")}
          </span>
        </div>

        <button className="btn-Add" onClick={addToCart}>
          {t("product.addToCart")}
        </button>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{t("product.addedTitle")} 🎉</h3>
              <p>{t("product.addedMessage")}</p>
              <div className="modal-actions">
                <button onClick={() => navigate("/cart")} className="btn-Add">
                  {t("product.viewCart")}
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="btn-Add"
                >
                  {t("product.continueShopping")}
                </button>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
            </div>
          </div>
        )}

        {/* Bouton ajouter un avis */}
        <div className="review-button">
          <button
            className="btn-Add"
            onClick={() => navigate(`/review/${product._id}`)}
          >
            ✍️ Ajouter un avis
          </button>
        </div>

        {/* ⭐ Bloc résumé des avis */}
        <div className="review-summary">
          <h3>Note et avis</h3>
          {/* <p className="average-rating">
            {product.rating.toFixed(1)} / 5 ⭐ ({comments.length})
          </p> */}

          <p className="average-rating">
  {product?.rating?.toFixed ? product.rating.toFixed(1) : "—"} / 5 ⭐ ({comments.length})
</p>


          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = comments.filter((c) => c.rating === star).length;
              return (
                <div key={star} className="rating-row">
                  <span>{star} ★</span>
                  <progress value={count} max={comments.length}></progress>
                  <span>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🗨️ Bloc affichage des commentaires */}
        <div className="comments-section">
          <h3>Commentaires</h3>

          {comments.length === 0 && <p>Aucun commentaire pour le moment.</p>}

          {comments.map((comment) => (
            <div key={comment._id} className="comment-card">
              <p>
                <strong>{comment.userId?.username || "Utilisateur"}</strong> —{" "}
                {comment.rating} ★
              </p>
              <p>{comment.text}</p>
                    <div className="comment-actions">
         <button onClick={() => likeComment(comment._id)}> 👍 {comment.likes?.length || 0} </button>
         <button onClick={() => dislikeComment(comment._id)}> 👎 {comment.dislikes?.length || 0} </button>
         <button onClick={() => reportComment(comment._id)}> {t("product.report")} </button>
      </div>
              <small>
                {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
              </small>
            </div>
          ))}
        </div>

        {/* 🔹 Admin */}
        {(role === "admin" || role === "vendeur") && (
          <div className="admin-action">
            <Link to="/admin/add-product" className="btn-Add">
              ➕ {t("product.addProduct")}
            </Link>
            <Link
              to={`/admin/EditProduct/${product._id}`}
              className="btn-Add"
            >
              {t("product.edit")}
            </Link>
            <Link
              to="/admin/AdminProductManagement"
              className="btn-Add"
            >
               {t("product.delete")}
            </Link>
             <Link to="/admin/promotions"  className="btn-Add">
          Créer une promotion
        </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Product;





























/*
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
 const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/products/${id}`
        );
        setProduct(response.data);

      setSelectedOption(null);
        if (response.data.rating) {
          setUserRating(Number(response.data.rating));
        }

      } catch (err) {
        setError("Produit introuvable ou erreur serveur.");
      }
    };

    fetchProduct();
  }, [id]);

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

useEffect(() => {
  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/products/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Erreur récupération commentaires", err);
    }
  };

  fetchComments();
}, [id]);

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
  if (error) return <p>{t("product.error")}</p>;
  if (!product) return <p>{t("product.loading")}</p>;
  
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
    value={selectedOption ? selectedOption.size : ""}
    onChange={(e) => {
      const selected = product.options.find(
        (opt) => opt.size.toString() === e.target.value
      );
      setSelectedOption(selected);
    }}
  >

    <option value="">
      {t("product.selectSize")}
    </option>


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

       <div className="review-button">
  <button 
    className="btn-Add" 
    onClick={() => navigate(`/review/${product._id}`)}
  >
    ✍️ Ajouter un avis
  </button>
</div>

       <div className="review-summary">
    
          <h3>Note et avis</h3>
           <p className="average-rating">
           {product.rating.toFixed(1)} / 5 ⭐ ({product.comments.length})
        
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
*/




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

  

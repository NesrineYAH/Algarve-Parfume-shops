import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Product.scss";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
  import * as CartService from "../../Services/cart"; // ton service frontend
import { UserContext } from "../../context/UserContext";
import { CartContext } from "../../context/CartContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import StarRating from "../../components/StarRating/StarRating"; 

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [comments, setComments] = useState([]);
const [quantity, setQuantity] = useState(1);
const { user } = useContext(UserContext);
const { addToCartContext } = useContext(CartContext);
const { favorites, toggleFavorite } = useContext(FavoritesContext);
const safeFavorites = Array.isArray(favorites) ? favorites : [];

// À SUPPRIMER (ils ne servent plus dans Product.jsx)
const [hoverRating, setHoverRating] = useState(0);
const [userRating, setUserRating] = useState(0);

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

const addToCart = async () => {
  if (!selectedOption) {
    alert("Veuillez sélectionner une option.");
    return;
  }
const variantId = `${product._id}-${selectedOption.size}${selectedOption.unit}`;       

  const item = {
    variantId: variantId, // ✅ LA SEULE BONNE VALEUR
    productId: product._id,
    nom: product.nom,
    imageUrl: product.imageUrl,
    quantite: quantity,
    options: {
      size: selectedOption.size,
      unit: selectedOption.unit,
      prix: selectedOption.prix,
    },
  };

  // 👤 UTILISATEUR NON CONNECTÉ → localStorage
  if (!user?._id) {
    addToCartContext(item);
    setShowModal(true);
    return;
  }

  // 🔐 UTILISATEUR CONNECTÉ → backend
  try {
    await addToCartContext(item);
    setShowModal(true);
  } catch (err) {
    console.error("❌ addToCart backend error:", err);
    alert("Erreur ajout au panier");
  }
};

const reportComment = async (commentId) => {
  try {
    await axios.post(
      `http://localhost:5001/api/products/${id}/comments/${commentId}/report`,
      {},
      { 
     
     headers: { "Content-Type": "application/json" },
    withCredentials: true, // ✅ pour envoyer les cookies HttpOnly
    }
    );

    alert("Commentaire signalé !");
  } catch (err) {
    console.error("Erreur lors du signalement :", err);
    alert("Impossible de signaler ce commentaire.");
  }
};

const likeComment = async (commentId) => {
  try {
    const res = await axios.post(
     `http://localhost:5001/api/products/${id}/comments/${commentId}/like`,
      {},
      { 
     headers: { "Content-Type": "application/json" },
    withCredentials: true, // ✅ pour envoyer les cookies HttpOnly
    }
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
    const res = await axios.post(
    `http://localhost:5001/api/products/${id}/comments/${commentId}/dislike`,
      {},
      { 
      headers: { "Content-Type": "application/json" },
    withCredentials: true, // ✅ pour envoyer les cookies HttpOnly
     }
    );
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? res.data : c))
    );
  } catch (err) {
    console.error(err);
  }
};
const refresh = () => {
    axios.get(`http://localhost:5001/api/products/${id}/comments`)
      .then(res => setComments(res.data));
};

const increaseQuantity = () => {
  setQuantity((prev) => prev + 1);
};
const decreaseQuantity = () => {
  setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
};
useEffect(() => {
  setQuantity(1);
}, [selectedOption]);

  if (error) return <p>{t("product.error")}</p>;
  if (!product) return <p>{t("product.loading")}</p>;

  //04/01/2026
  const minPrice =
  product.options && product.options.length > 0
    ? Math.min(...product.options.map(opt => opt.prix))
    : null;

  const isFavorite = safeFavorites.some(
  (fav) => fav._id === product?._id
);
  //19/02 // ✅ CALCUL DE LA MOYENNE
  const averageRating =
    comments.length > 0
      ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
      : 0;


  return (
    <section id="page">
      <div className="product-container">
        <div className="product">
          
          <div className="product__img">
          <img
            src={`http://localhost:5001${product.imageUrl}`}
            alt={product.nom}
            className="product-image"
          />

    <div className="card__favorite" onClick={() => toggleFavorite(product)}>
          <Heart className={`icone ${isFavorite ? "active" : ""}`} /></div>
          </div>

         <div className="product__part">  
   
          <h2>{product.nom}</h2>
          <p>{product.description}</p>
        <p className="price">
  Prix :{" "}
  {selectedOption ? (
    <>
      {selectedOption.prix} €
    </>
  ) : (
    <>
      {minPrice} €
    </>
  )}
</p>
      {product.options && product.options.length > 0 && (
        <div className="product-options">
    {/* <p className="option-label">{t("product.chooseOption")}</p> */}

    <div className="option-buttons">
      {product.options.map((opt, index) => {
        const isSelected = selectedOption?.size === opt.size;
        return (
  
          <button 
            key={index}
            className={`option-btn ${isSelected ? "active" : ""}`}
            onClick={() => setSelectedOption(opt)}>
            {opt.size}
            {opt.unit}
          </button>
        );
      })}
    </div>
          </div>
          )}
    <p>
            <strong>{t("product.stock")} :</strong> {product.stock}{" "}
            {t("product.inStock")}
          </p>

        {/* Quantité */}
     <div className="quantity-selector">
  <button onClick={decreaseQuantity} className="qty-btn">
    −
  </button>

  <span className="qty-value">{quantity}</span>

  <button onClick={increaseQuantity} className="qty-btn">
    +
  </button>
      </div>
      <p> Expédition 24/72h </p>

          <button className="btn-Add" onClick={addToCart}>
          {t("product.addToCart")}
        </button>
 <br />
  <br />
  <br />


         
        </div>

        </div>
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

  
        <div className="review-button">
          <button
            className="btn-Add"
            onClick={() => navigate(`/review/${product._id}`)}
          >
            ✍️ Ajouter un avis
          </button>
        </div>

 <div className="review-summary">
   <h3>{t("product.titre")}</h3>

  {/* Étoiles basées sur la note moyenne */}
  <StarRating rating={Math.round(averageRating)} />

  <p className="average-rating">
    <strong>{t("reviews.average")}:</strong> {" "}
    {averageRating.toFixed(1)} / 5 ⭐ ({comments?.length || 0} {t("reviews.avis")})
  </p>

  
  <div className="rating-breakdown">
    {[5, 4, 3, 2, 1].map((star) => {
      const count = comments?.filter((c) => c.rating === star).length || 0;
      const percentage = comments?.length > 0 ? (count / comments.length) * 100 : 0;
      
      return (
        <div key={star} className="rating-row" style={{ marginBottom: "8px" }}>
          <span style={{ width: "50px", display: "inline-block" }}>{star} ★</span>
          <progress 
            value={count} 
            max={comments?.length || 1} 
            style={{ width: "200px", margin: "0 10px" }}
          ></progress>
          <span>{count} {t("reviews.avis")}</span>
          <span style={{ marginLeft: "10px", color: "#666" }}>
            ({percentage.toFixed(0)}%)
          </span>
        </div>
      );
    })}
  </div>
 </div>


      {/* 
       <div>
   <h3>Note et avis</h3>
  <div className="rating-input">

    <div>
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
            style={{ cursor: "pointer", fontSize: "24px" }}
          >
            ★
          </span>
        );
      })}
      <span style={{ marginLeft: "10px" }}>
        {userRating > 0 ? `Note: ${userRating}/5` : ""}
      </span>
    </div>
  </div>


  <p className="average-rating">
    <strong>Note moyenne :</strong>{" "}
    {product?.rating ? product.rating.toFixed(1) : "0.0"} / 5 ⭐ 
    ({comments?.length || 0} avis)
  </p>


  <div className="rating-breakdown">
    {[5, 4, 3, 2, 1].map((star) => {
      const count = comments?.filter((c) => c.rating === star).length || 0;
      const percentage = comments?.length > 0 ? (count / comments.length) * 100 : 0;
      
      return (
        <div key={star} className="rating-row" style={{ marginBottom: "8px" }}>
          <span style={{ width: "50px", display: "inline-block" }}>{star} ★</span>
          <progress 
            value={count} 
            max={comments?.length || 1} 
            style={{ width: "200px", margin: "0 10px" }}
          ></progress>
          <span>{count} avis</span>
          <span style={{ marginLeft: "10px", color: "#666" }}>
            ({percentage.toFixed(0)}%)
          </span>
        </div>
      );
    })}
  </div>
      </div>
*/}

        {/* 🗨️ Bloc affichage des commentaires */}
        <div className="comments-section">
          <h3>{t("product.comments")}</h3>

          {comments.length === 0 && <p>{t("product.noComments")}</p>}

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
         <button onClick={() => reportComment(comment._id)}> {t("product.report")} 🚩</button>
      </div>
              <small>
                {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
              </small>
            </div>
          ))}
        </div>

        {/* 🔹 Admin */}
        {user && (user.role === "admin" || user.role === "vendeur") && (
  <div className="admin-action">
    <Link
      to={`/admin-dashboard/EditProduct/${product._id}`}
      className="btn-Add"
    >
      {t("product.edit")}
    </Link>

    <Link
      to={`/admin-dashboard/DeleteProduct/${product._id}`}
      className="btn-Add"
    >
      {t("product.delete")}
    </Link>

  
  </div>
)}

        
      </div>
    </section>
  );
};

export default Product;




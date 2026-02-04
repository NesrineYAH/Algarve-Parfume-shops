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
const [quantity, setQuantity] = useState(1);
const { user } = useContext(UserContext);
const { addToCartContext } = useContext(CartContext);
const { favorites, toggleFavorite } = useContext(FavoritesContext);
const safeFavorites = Array.isArray(favorites) ? favorites : [];

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
    const token = localStorage.getItem("token"); // 🔥 Manquait !

    if (!token) {
      alert("Vous devez être connecté pour signaler un commentaire.");
      return;
    }

    await axios.post(
      `http://localhost:5001/api/products/${id}/comments/${commentId}/report`,
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

const likeComment = async (commentId) => {
  //  `http://localhost:5001/api/products/${commentId}/like`,
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
     `http://localhost:5001/api/products/${id}/comments/${commentId}/like`,
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
    `http://localhost:5001/api/products/${id}/comments/${commentId}/dislike`,
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
  

  return (
    <section id="page">
      <div className="product-container">
        <div className="pr">
          
          <div className="pr__img">
          <img
            src={`http://localhost:5001${product.imageUrl}`}
            alt={product.nom}
            className="product-image"
          />
       {/* <div className="card__favorite" onClick={addToFavorites}>*/}
    <div className="card__favorite" onClick={() => toggleFavorite(product)}>
  <Heart className={`icone ${isFavorite ? "active" : ""}`} />
</div>

        
          </div>
         <div className="pr__part">  
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

      
      <div className="AutreSection">
          <h2>Alma</h2>
          <strong>Payez en 3X ou 4X avec Alma</strong>
          <span>Payez en plusieurs fois grâce à notre partenaire <strong>ALMA</strong> ALMA, réponse immédiate. Plus d'informations </span>
        </div>

  {/* Rating 
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
        */}
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

  <br />
  <br />
    <br />
  <br />
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
         <button onClick={() => reportComment(comment._id)}> {t("product.report")} 🚩</button>
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
      
            <Link
              to={`/EditProduct/${product._id}`}
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
        
          </div>
        )}
      </div>
    </section>
  );
};

export default Product;



/*
const favoriteItem = {
  productId: product._id,
 variantId: `${product._id}-${selectedOption.size}`,
  nom: product.nom,
  imageUrl: product.imageUrl,
  size: selectedOption.size,
 prix: selectedOption.prix,

};
*/


/*
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!selectedOption) {
      alert("Veuillez sélectionner une option.");
      return;
    }

    const variantId = `${product._id}-${selectedOption.size}`;
    const existing = cart.find((item) => item.variantId === variantId);

    if (existing) {
      existing.quantite += quantity;

    } else {
      cart.push({
        productId: product._id,
        variantId,
        nom: product.nom,
        imageUrl: product.imageUrl,
        quantite: quantity,
        options: selectedOption,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setShowModal(true);
  };
*/

   {/* <strong>{t("product.selectedPrice")} :</strong>{" "} */}
          {/* Options
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
 */}



























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

  

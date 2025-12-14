import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Product.scss";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null); // option choisie
  const role = localStorage.getItem("role");
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

  if (error) return <p>{error}</p>;
  if (!product) return <p>Chargement du produit...</p>;


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
            <strong>Stock :</strong> {product.stock} en stock
          </p>
          <p>{product.description}</p>

          {product.options && product.options.length > 0 && (
            <div className="product-options">
              <label>Choisir une option :</label>
              <select
                value={product.options.indexOf(selectedOption)}
                onChange={(e) =>
                  setSelectedOption(product.options[e.target.value])
                }
              >
                {product.options.map((opt, index) => (
                              
                  <option 
                  key={index} value={index}>
                    {opt.size} {opt.unit} - {opt.prix} €
                  </option>
                  
                ))}
              </select>
              <p>
                <strong>Prix sélectionné :</strong>{" "}
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
              className={i < (product.rating || 0) ? "star filled" : "star"}
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

        <button className="btn-Add" onClick={addToCart}>
          Ajouter au panier
        </button>
      </div>
      {/* 🔥 MODAL  03/12/2025*/}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Produit ajouté 🎉</h3>
            <p>Votre produit a bien été ajouté au panier.</p>
            <div className="modal-actions">
              <button onClick={() => navigate("/cart")} className="btn-Add">
                Voir mon panier
              </button>
              <button onClick={() => navigate("/home")} className="btn-Add">
                Continuer mes achats
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
            ➕ Ajouter un produit
          </Link>

          <Link to={`/admin/EditProduct/${product._id}`}>Modifier</Link>

          <Link to="/admin/AdminProductManagement" className="btn-Add">
            ➕ Supprimer un produit
          </Link>
        </div>
      )}
    </section>
  );
};

export default Product;

//30/11 function addToCart
/*
const addToCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const selectedSize = selectedOption.size;


  const existing = cart.find(
    (item) => item._id === product._id && item.option.size === selectedSize
  );

  if (existing) {

    existing.Quantite += 1;
  } else {
    cart.push({
      _id: product._id,
      nom: product.nom,
      imageUrl: product.imageUrl,
      Quantite: 1, épart
      option: {
        size: selectedSize, 
        unit: selectedOption.unit, 
        prix: selectedOption.prix, on
      },
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produit ajouté au panier !");
};
*/
//30/11 function addToCart

/*
 const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    

    // Vérifie si le produit avec la même option est déjà dans le panier
    const existing = cart.find(
      (item) =>
        item.id === product._id &&
        item.option.quantity === selectedOption.quantity
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product._id,
        nom: product.nom,
        option: selectedOption,
        quantity: 1,
      });
    }
      */

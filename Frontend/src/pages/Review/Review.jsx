import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Review.scss"; 


const Review = () => {
  const { id } = useParams(); // ← ID du produit
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !text.trim()) {
      setError("Merci de donner une note et un commentaire.");
      return;
    }

    try {
      setError("");
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5001/api/products/${id}/comments`,
        { rating, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Votre avis a été envoyé avec succès !");
      setRating(0);
      setText("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du commentaire.");
    }
  };

  return (
    <section className="review-page">
      <h2>Donner votre avis</h2>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="rating-input">
          <label>Votre note :</label>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < rating ? "star filled" : "star"}
              onClick={() => setRating(i + 1)}
              style={{ cursor: "pointer" }}
            >
              ★
            </span>
          ))}
        </div>

        <div className="text-input">
          <label>Votre commentaire :</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écrivez votre avis ici..."
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="btn-submit">
          Envoyer mon avis
        </button>
      </form>
    </section>
  );
};

export default Review;



//        `http://localhost:5001/api/products/${id}/comments`,
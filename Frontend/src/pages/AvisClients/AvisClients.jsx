import React, { useEffect, useState, useContext } from "react";
import ReviewCard from "../../components/ReviewSection/ReviewCard";
import { CommentsContext } from "../../context/CommentsContext";
import "../Review/Review.scss"


const AvisClients = () => {
  const { comments, loading, addComment  } = useContext(CommentsContext); // ✅ source unique

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    await addComment({
      name: "Client vérifié", // plus tard depuis l’auth
      rating,
      comment,
    });

    setComment("");
    setRating(5);
    setSending(false);
  };

  if (loading) return <p>Chargement des avis...</p>;

  return (
    <div className="review-page">
      <h1>Avis clients</h1>
      <p>Avis sur la marque et l’expérience d’achat.</p>

      {comments.length === 0 && <p>Aucun avis pour le moment.</p>}

      {comments.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
      <div>
        <h2>Laisser un avis</h2>
        <form onSubmit={handleSubmit} className="review-form">       
        <div className="rating-input">
         <label>Votre note :</label>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{
              cursor: "pointer",
              fontSize: "24px",
              color: rating >= star ? "#f5a623" : "#ccc",
            }}
          >
            ★
          </span>
        ))}
      </div>

      <label>Votre Avis: </label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        placeholder="Décrivez votre expérience d'achat"
      />

      <button type="submit" disabled={sending}>
        {sending ? "Envoi..." : "Envoyer mon avis"}
      </button>

      <p style={{ fontSize: "12px" }}>
        Avis réservé aux clients ayant effectué une commande.
      </p>
    </form>

      </div>
    </div>
  );
};

export default AvisClients;




























/*
const reviews = [
  {
    id: 1,
    name: "Sofia",
    rating: 5,
    comment: "Parfum authentique, livraison rapide, je recommande !",
    date: "12/09/2025",
  },
  {
    id: 2,
    name: "Karim",
    rating: 4,
    comment: "Très bonne tenue, emballage soigné.",
    date: "08/09/2025",
  },
  {
    id: 3,
    name: "Laura",
    rating: 5,
    comment: "Service client au top, parfum original.",
    date: "02/09/2025",
  },
];
*/
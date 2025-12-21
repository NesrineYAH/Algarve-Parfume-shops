import React, { useEffect, useState, useContext } from "react";
import ReviewCard from "../../components/ReviewSection/ReviewCard";
import { CommentsContext } from "../../context/CommentsContext";


const AvisClients = () => {
  const { comments, loading } = useContext(CommentsContext); // ✅ source unique

  if (loading) return <p>Chargement des avis...</p>;

  return (
    <div className="legal-page">
      <h1>Avis clients</h1>
      <p>Avis sur la marque et l’expérience d’achat.</p>

      {comments.length === 0 && <p>Aucun avis pour le moment.</p>}

      {comments.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
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
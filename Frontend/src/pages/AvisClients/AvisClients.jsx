import React from "react";
import ReviewCard from "../../components/ReviewSection/ReviewCard";

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

const AvisClients = () => {
  return (
    <div className="legal-page">
      <h1>Avis de nos clients</h1>
      <p>
        Découvrez les avis laissés par nos clients après leur commande.
      </p>

      <div className="reviews-list">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default AvisClients;

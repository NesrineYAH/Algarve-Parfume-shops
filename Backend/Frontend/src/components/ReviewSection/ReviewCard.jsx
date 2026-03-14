import React from "react";
import "./ReviewSection.scss";

const ReviewCard = ({ review }) => {
  const { rating, text, userId, createdAt } = review;

  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className="review-card">
      <div className="review-header">
        <strong>{userId?.name || "Utilisateur"}</strong>
        <span>{formattedDate}</span>
      </div>
      <div className="review-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} style={{ color: rating >= star ? "#f5a623" : "#ccc" }}>
            ★
          </span>
        ))}
      </div>
      <p>{text}</p>
    </div>
  );
};

export default ReviewCard;


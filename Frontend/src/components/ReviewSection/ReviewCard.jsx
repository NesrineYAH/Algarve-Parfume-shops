import React from "react";

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      <h4>{review.name}</h4>

      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} style={{ color: "#f5a623" }}>
            {review.rating >= star ? "★" : "☆"}
          </span>
        ))}
      </div>

      <p>{review.comment}</p>

      <small>{review.date}</small>
    </div>
  );
};

export default ReviewCard;

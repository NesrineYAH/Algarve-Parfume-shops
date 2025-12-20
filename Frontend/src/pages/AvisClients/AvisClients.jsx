import React from "react";
import { useNavigate } from "react-router-dom";

const RatingStars = ({ rating = 4.5, totalReviews = 128 }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/avis-clients")}
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
    >
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} style={{ color: "#f5a623", fontSize: "18px" }}>
            {rating >= star ? "★" : "☆"}
          </span>
        ))}
      </div>
      <span style={{ marginLeft: "8px", fontSize: "14px" }}>
        {rating}/5 ({totalReviews} avis)
      </span>
    </div>
  );
};

export default RatingStars;

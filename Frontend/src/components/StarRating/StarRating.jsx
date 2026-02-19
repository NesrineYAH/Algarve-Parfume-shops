import React from "react";
import styles from "./StarRating.module.scss";

const StarRating = ({ rating }) => {
  return (
    <div className={styles.starRating}>
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        return (
          <span
            key={i}
            className={`${styles.star} ${
              starValue <= rating ? styles.filled : ""
            }`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;



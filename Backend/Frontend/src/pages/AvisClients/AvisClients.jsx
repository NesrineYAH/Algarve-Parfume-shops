import React, { useState, useContext } from "react";
import ReviewCard from "../../components/ReviewSection/ReviewCard";
import { AvisContext } from "../../context/AvisContext";
import "../Review/Review.scss";
import { useTranslation } from "react-i18next";

const AvisClients = () => {
  const { avis, loading, addAvis } = useContext(AvisContext); // ✅ source unique 
const {t} = useTranslation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState(""); // ✅ comment défini
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await addAvis({
        rating,
        text: comment, // correspond au schéma Avis.text
      });

      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis :", error);
    }

    setSending(false);
  };

  if (loading) return <p>Chargement des avis...</p>;

  return (
    <section className="Reviewpage"> 
       <h1>{t("reviews.title")}</h1>
      <p>
        {t("reviews.intro")}
      </p>
    <div className="review-page">
      {avis.length === 0 && <p>{t("reviews.noReviews")}</p>} 

       {avis.map((review, index) => (
      <ReviewCard key={review._id || index} review={review} />
    ))}

 
    </div>
         <div className="review-form">
        <h2>{t("reviews.let")}</h2>
        <form onSubmit={handleSubmit}>       
          <div className="rating-input">
            <label>{t("reviews.write")}</label>
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

          <label>{t("reviews.comment")}</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder="Décrivez votre expérience d'achat"
          />

          <button type="submit" disabled={sending}>
            {t("reviews.submit")}
          </button>

          <p style={{ fontSize: "12px" }}>
            {t("reviews.disclaimer")}
          </p>
        </form>
      </div>
    </section>
  );
};

export default AvisClients;
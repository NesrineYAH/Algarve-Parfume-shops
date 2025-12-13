// src/components/Newsletter.jsx
import React, { useState } from "react";
import "./Newsletter.scss";
import { useTranslation } from "react-i18next";

export default function Newsletter() {
    const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Merci pour votre inscription : ${email}`);
      setEmail("");
    } else {
      alert("Veuillez entrer un email valide !");
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter-container">
        <h2>{t("newsletter.title")}</h2>
        <p>{t("newsletter.prg")}</p>
        <form onSubmit={handleSubscribe} className="newsletter-form">
          <input
            type="email"
            placeholder="votre mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">{t("newsletter.subscribe")}</button>
        </form>
      </div>
    </section>
  );
}

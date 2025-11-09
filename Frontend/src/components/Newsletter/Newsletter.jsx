// src/components/Newsletter.jsx
import React, { useState } from "react";
import "./Newsletter.scss";

export default function Newsletter() {
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
        <h2>Inscrivez-vous à la newsletter MyPerfume</h2>
        <p>Accédez en avant-première aux bons plans & nouveautés.</p>
        <form onSubmit={handleSubscribe} className="newsletter-form">
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">S’inscrire</button>
        </form>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import "./Contact.scss"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
      reason: "", // 👈 nouveau champ
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Envoi en cours...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Erreur lors de l’envoi du message.");
      }
    } catch (error) {
      setStatus("Erreur serveur.");
    }
  };

  return (
<div className="contact-container">
  <div className="contact-card">
    <h1 className="contact-title">Contactez-nous</h1>

    <form onSubmit={handleSubmit} className="contact-form">

      <div>
   <div>
  <label className="contact-label">Motif du contact</label>
  <select
    name="reason"
    value={formData.reason}
    onChange={handleChange}
    required
    className="contact-input" >   // mêmes styles que les inputs
 
    <option value="">-- Sélectionnez un motif --</option>
    <option value="commande">Problème avec ma commande</option>
    <option value="produit">Question sur un produit</option>
    <option value="retour">Faire un retour ou un remboursement</option>
    <option value="compte">Problème de compte</option>
    <option value="autre">Autre demande</option>
  </select>
    </div>
        <label className="contact-label">Nom</label>
        <input
          className="contact-input"
       
        />
      </div>

      <div>
        <label className="contact-label">Email</label>
        <input
          className="contact-input"
     
        />
      </div>

      <div>
        <label className="contact-label">Message</label>
        <textarea
          className="contact-textarea"
       
        />
      </div>

      <button className="contact-button" type="submit">
        Envoyer
      </button>
    </form>

    {status && <p className="contact-status">{status}</p>}
  </div>
</div>

  );
}

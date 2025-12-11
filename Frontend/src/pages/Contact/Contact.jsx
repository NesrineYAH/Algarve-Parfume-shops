import React, { useState } from "react";
import "./Contact.scss";
import { sendContact } from "../../Services/contactService";

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
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
    const response = await sendContact(formData);

    if (response.success) {
      setStatus("Message envoyé avec succès !");
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        message: "",
        reason: "",
      });
    } else {
      setStatus("Erreur lors de l’envoi.");
    }

  } catch (error) {
    console.error("Erreur formulaire contact:", error);
    setStatus("Erreur lors de l’envoi.");
  }
};



  return (
<div className="contact-container">
  <div className="contact-card">
    <h1 className="contact-title">Contactez-nous</h1>

    <form onSubmit={handleSubmit} className="contact-form">
 
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
     <div>
        <label className="contact-label">Nom</label>
        <input
           name="nom"
           value={formData.nom}
            onChange={handleChange}
          className="contact-input"
        />
      </div>
  <div>
        <label className="contact-label">Prénom</label>
        <input
           name="prenom"
           value={formData.prenom}
            onChange={handleChange}
          className="contact-input"
        />
      </div>
      <div>
        <label className="contact-label">Email</label>
        <input  
          className="contact-input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange} />
      </div>

      <div>
        <label className="contact-label">Message</label>
        <textarea
          name="message"
          className="contact-textarea"
           value={formData.message} 
             onChange={handleChange}
        />
      </div>

      <button className="contact-button" type="submit">
        Envoyer
      </button>
    </form>

    {/* {status && <p className="contact-status">{status}</p>} */}
    {status && (
  <p
    className={`status-message ${
      status.includes("succès") ? "success" : "error"
    }`}
  >
    {status}
  </p>
)}

  </div>
</div>

  );
}

/*
  try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message envoyé avec succès !");
        setFormData({ name: "", email: "", message: "", reason: "" });
      } else {
        setStatus("Erreur lors de l’envoi du message.");
      }
    } catch (error) {
      setStatus("Erreur serveur.");
    }
      */

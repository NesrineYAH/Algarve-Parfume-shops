import React, { useState } from "react";
import "./Contact.scss";
import { sendContact } from "../../Services/contactService";
import { useTranslation } from "react-i18next";
import { FaPhoneFlip  } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { faLocationDot, faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function Contact() {
  const { t } = useTranslation();
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
        <h1 className="contact-title">{t("contact.title")}</h1>

        <form onSubmit={handleSubmit} className="contact-form">

          <div>
            <label className="contact-label">{t("contact.reason_label")}</label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              className="contact-input">
              <option value="">{t("contact.reason_default")}</option>
              <option value="commande">{t("contact.reason_commande")}</option>
              <option value="produit">{t("contact.reason_produit")}</option>
              <option value="retour">{t("contact.reason_retour")}</option>
              <option value="compte">{t("contact.reason_compte")}</option>
              <option value="autre">{t("contact.reason_autre")}</option>
            </select>
          </div>

          <div>
            <label className="contact-label">{t("contact.nom")}</label>
            <input
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="contact-input"
            />
          </div>

          <div>
            <label className="contact-label">{t("contact.prenom")}</label>
            <input
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="contact-input"
            />
          </div>

          <div>
            <label className="contact-label">{t("contact.email")}</label>
            <input
              className="contact-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="contact-label">{t("contact.message")}</label>
            <textarea
              name="message"
              className="contact-textarea"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button className="contact-button" type="submit">
            {t("contact.send")}
          </button>
        </form>

        {status && (
          <p
            className={`status-message ${
              status.includes(t("contact.success")) ? "success" : "error"
            }`}
          >
            {status}
          </p>
        )}
      </div>
     <div className="service-client">

      <p className="intro">{t("service.intro")}</p>

      <div className="contact-options">
        <h2>{t("service.contact")}</h2>
        <ul>
          <li>{t("service.hours")}</li>
          <li>  <IoMail /> {t("service.email")}</li>
          <li><FaPhoneFlip /> {t("service.phone")}</li>
             <li> <FontAwesomeIcon icon={faLocationDot}  /> Av. Francisco Sá Carneiro, 8125-507 Quarteira, Portugal </li>
        </ul>
        <div className="chat-service">
        <FontAwesomeIcon icon={faComments} size="2x" />
        <span>Chatter avec notre service client</span>
      </div>
      </div>
        
    </div> 
    </div> 
    
  );

}

/*


*/
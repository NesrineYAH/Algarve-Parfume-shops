import React, { useState } from 'react';
import './PolitiqueCookies.scss';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PolitiqueCookies() {
  // État des préférences
  const [preferences, setPreferences] = useState({
    pref: false,
    Nessary: false,
    analytics: false,
    marketing: false,
       audience: false,
      develop: false,
  });

  const [message, setMessage] = useState("");

  // Fonction pour gérer les changements dans les checkboxes
  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPreferences({ ...preferences, [name]: checked });
  };

  // Fonction "Enregistrer"
  const handleSave = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setMessage("Vos préférences ont été enregistrées.");
  };

  // Fonction "Refuser tout"
  const handleRejectAll = () => {
    const reset = {
      pref: false,
      Nessary: false,
      analytics: false,
      marketing: false,
      audience: false,
      develop: false,
    };

    setPreferences(reset);
    localStorage.setItem("cookie-consent", JSON.stringify(reset));
    setMessage("Tous les cookies facultatifs ont été refusés.");
  };



 const ToggleChevron = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };
}

  return (
    <div className="cookie-page">
      <h1>Politique de cookies</h1>

      <p>
        Cette page explique comment notre site utilise les cookies pour améliorer votre expérience
        et assurer le bon fonctionnement du service.
      </p>

      <div className="highlight">
           <p> Vous pouvez à tout moment modifier vos préférences via le bouton “Gérer mes cookies” en bas de page.  </p>
   

      <h2>Catégories de cookies</h2>

      <div className="consent-section">
        <h3>Gérer votre consentement</h3>

        <div className="consent-options">
          <div className="option">
                 <label><strong>Cookies Nécessaires: assurent le fonctionnement du site.</strong></label>
            <input
              type="checkbox"
              name="Nessary"
              checked={preferences.Nessary}
              onChange={handleChange}
            />
          </div>
  
          <div className="option">
            <label><strong>Cookies de Préférences: mémorisent vos choix.</strong></label>
            <input
              type="checkbox"
              name="pref"
              checked={preferences.pref}
              onChange={handleChange}
            />
          </div>

          <div className="option">
            <label><strong>Cookies analytics nous aident à comprendre l’utilisation du site.</strong></label>
            <input
              type="checkbox"
              name="analytics"
              checked={preferences.analytics}
              onChange={handleChange}
            />
          </div>

          <div className="option">
            <label><strong>Cookies Marketing permettent des publicités personnalisées:</strong></label>
            <input
              type="checkbox"
              name="marketing"
              checked={preferences.marketing}
              onChange={handleChange}
            />
          </div>

             <div className="option">
            <label><strong>Développer et améliorer les services</strong></label>
            <input
              type="checkbox"
              name="develop"
              checked={preferences.develop}
              onChange={handleChange}
            />
          </div>
          
             <div className="option">
            <label><strong>Cookies Mesure d'audience</strong></label>
            <input
              type="checkbox"
              name="audience"
              checked={preferences.audience}
              onChange={handleChange}
            />
          </div>

          
        </div>

        <div className="actions">
          <button className="btn-outline" onClick={handleRejectAll}>
            Refuser tout
          </button>

          <button className="btn-primary" onClick={handleSave}>
            Enregistrer
          </button>
        </div>

        {message && <p className="feedback">{message}</p>}
      </div>
   </div>
    </div>
  );
}

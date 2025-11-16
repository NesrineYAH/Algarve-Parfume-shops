import React, { useState } from 'react';
import '';
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Confientilaite() {

  // État des préférences
  const [preferences, setPreferences] = useState({
    pref: false,
    necessary: false,
    analytics: false,
    marketing: false,
    audience: false,
    develop: false,
  });

  const [message, setMessage] = useState("");

  // État de l'accordéon (chevron open/close)
  const [openPref, setOpenPref] = useState(false);

  const togglePref = () => {
    setOpenPref(!openPref);
  };

  // Checkbox changement
  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPreferences({ ...preferences, [name]: checked });
  };

  // Enregistrer
  const handleSave = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setMessage("Vos préférences ont été enregistrées.");
  };

  // Refuser tout
  const handleRejectAll = () => {
    const reset = {
      pref: false,
      necessary: false,
      analytics: false,
      marketing: false,
      audience: false,
      develop: false,
    };

    setPreferences(reset);
    localStorage.setItem("cookie-consent", JSON.stringify(reset));
    setMessage("Tous les cookies facultatifs ont été refusés.");
  };

  return (
    <div className="cookie-page">
      <h1>Politique de cookies</h1>

      <p>
        Cette page explique comment notre site utilise les cookies pour améliorer votre expérience
        et assurer le bon fonctionnement du service.
      </p>

      <div className="highlight">
        <p>Vous pouvez à tout moment modifier vos préférences via le bouton “Gérer mes cookies” en bas de page.</p>
      </div>

      <h2>Catégories de cookies</h2>

      <div className="consent-section">

        {/* Cookies nécessaires */}
        <div className="option">
          <label><strong>Cookies nécessaires : assurent le fonctionnement du site.</strong></label>
          <input
            type="checkbox"
            name="necessary"
            checked={preferences.necessary}
            onChange={handleChange}
          />
        </div>

        {/* COOKIES DE PRÉFÉRENCES AVEC CHEVRON */}
        <article className="option">
          <div className="option__div" onClick={togglePref}>
            {/* Chevron selon l’état */}
            {openPref ? <ChevronUp size={22} /> : <ChevronDown size={22} />}

            <h3>Cookies de préférences : mémorisent vos choix.</h3>
          </div>

          {/* Checkbox */}
          <input
            type="checkbox"
            name="pref"
            checked={preferences.pref}
            onChange={handleChange}
          />

          {/* Contenu ouvert/fermé */}
          {openPref && (
            <div className="option__contenu contenu">
              <p>
                Ces cookies permettent de sauvegarder vos choix (langue, thème, préférences de navigation).
                Ils améliorent votre expérience utilisateur.
              </p>
            </div>
          )}
        </article>

        {/* Cookies analytics */}
        <div className="option">
          <label><strong>Cookies analytics : comprendre l'utilisation du site.</strong></label>
          <input
            type="checkbox"
            name="analytics"
            checked={preferences.analytics}
            onChange={handleChange}
          />
        </div>

        {/* BOUTONS */}
        <div className="actions">
          <button className="btn-outline" onClick={handleRejectAll}>Refuser tout</button>
          <button className="btn-primary" onClick={handleSave}>Enregistrer</button>
        </div>

        {message && <p className="feedback">{message}</p>}
      </div>
    </div>
  );
}


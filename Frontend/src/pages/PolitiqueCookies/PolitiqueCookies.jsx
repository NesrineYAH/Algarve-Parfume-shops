import React, { useState } from 'react';
import './PolitiqueCookies.scss';
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Confientilaite() {

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

  return (
    <div className="cookie-page">
      <h1>Politique de cookies</h1>
      <p>
        Cette page explique comment notre site utilise les cookies pour améliorer votre expérience
        et assurer le bon fonctionnement du service.
      </p>


        <h2>Catégories de cookies</h2>
        <p>Vous pouvez à tout moment modifier vos préférences via le bouton “Gérer mes cookies” en bas de page.</p>
  
      <div className="consent-section">
        <article className="option">
          <div className="option__div" onClick={togglePref}>
            {openPref ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            <h3>Cookies de préférences : mémorisent vos choix.</h3>
     <input
            type="checkbox"
            name="pref"
            checked={preferences.pref}
            onChange={handleChange}
          />
          </div>

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

          <article className="option">
          <div className="option__div" onClick={togglePref}>
            {openPref ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            <h3>Cookies analytics : comprendre l'utilisation du site.</h3>
     <input
            type="checkbox"
              name="analytics"
            checked={preferences.analytics}
            onChange={handleChange}
          />
          </div>

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

            <article className="option">
          <div className="option__div" onClick={togglePref}>
            {openPref ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            <h3>Cookies analytics : comprendre l'utilisation du site.</h3>
     <input
            type="checkbox"
             name="Nessary"
              checked={preferences.Nessary}
            onChange={handleChange}
          />
          </div>

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
        
       <article className="option">
          <div className="option__div" onClick={togglePref}>
            {openPref ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            <h3>Cookies Mesure d'audience.</h3>
     <input
            type="checkbox"
              name="audience"
              checked={preferences.audience}
            onChange={handleChange}
          />
          </div>

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

            <article className="option">
          <div className="option__div" onClick={togglePref}>
            {openPref ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            <h3>Cookies Mesure d'audience.</h3>
     <input
            type="checkbox"
               name="develop"
              checked={preferences.develop}
            onChange={handleChange}
          />
          </div>

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


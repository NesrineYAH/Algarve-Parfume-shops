import React, { useState, useEffect } from 'react';
import './pages.scss';

export default function PolitiqueCookies() {
  return (
    <div className="cookie-page">
      <h1>Politique de cookies</h1>
      <p>
        Cette page explique comment notre site utilise les cookies pour améliorer votre expérience et assurer le bon fonctionnement du service.
      </p>

      <div className="highlight">
        Vous pouvez à tout moment modifier vos préférences via le bouton “Gérer mes cookies” en bas de page.
      </div>

      <h2>Catégories de cookies</h2>
      <ul>
        <li><strong>Nécessaires :</strong> assurent le fonctionnement du site.</li>
        <li><strong>Préférences :</strong> mémorisent vos choix.</li>
        <li><strong>Analytics :</strong> nous aident à comprendre l’utilisation du site.</li>
        <li><strong>Marketing :</strong> permettent des publicités personnalisées.</li>
      </ul>

      <div className="consent-section">
        <h3>Gérer votre consentement</h3>
        <div className="consent-options">
          <div className="option">
            <label>Cookies de préférences</label>
            <input type="checkbox" />
          </div>
          <div className="option">
            <label>Cookies analytics</label>
            <input type="checkbox" />
          </div>
          <div className="option">
            <label>Cookies marketing</label>
            <input type="checkbox" />
          </div>
        </div>
        <div className="actions">
          <button className="btn-outline">Refuser tout</button>
          <button className="btn-primary">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

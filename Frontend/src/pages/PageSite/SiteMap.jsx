// pages/SiteMap/SiteMap.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./SiteMap.scss";

const SiteMap = () => {
  return (
    <div className="sitemap-page">
      <h1>Plan du site</h1>
      <p>Retrouvez facilement toutes les pages de notre boutique.</p>

      <div className="sitemap-sections">
        {/* Boutique */}
        <div className="sitemap-section">
          <h2>Boutique</h2>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/parfums">Nos parfums</Link></li>
            <li><Link to="/categories">Catégories</Link></li>
            <li><Link to="/promotions">Promotions</Link></li>
            <li><Link to="/panier">Panier</Link></li>
            <li><Link to="/commande">Passer commande</Link></li>
          </ul>
        </div>

        {/* Compte client */}
        <div className="sitemap-section">
          <h2>Mon compte</h2>
          <ul>
            <li><Link to="/login">Connexion</Link></li>
            <li><Link to="/register">Créer un compte</Link></li>
            <li><Link to="/profil">Mon profil</Link></li>
            <li><Link to="/commandes">Mes commandes</Link></li>
          </ul>
        </div>

        {/* Avis & confiance */}
        <div className="sitemap-section">
          <h2>Avis & Confiance</h2>
          <ul>
            <li><Link to="/avis-clients">Avis clients</Link></li>
            <li><Link to="/rgpd">Confidentialité des données (RGPD)</Link></li>
            <li><Link to="/rsgp">Sécurité générale des produits</Link></li>
          </ul>
        </div>

        {/* Informations légales */}
        <div className="sitemap-section">
          <h2>Informations légales</h2>
          <ul>
            <li><Link to="/cgv">Conditions Générales de Vente</Link></li>
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/PolitiqueConfidentialite">Mentions légales</Link></li>
            <li><Link to="/SecuriteProduits">RSGP</Link></li>
         <li><Link to="/sitemap">RGPD</Link></li>

          </ul>
        </div>

        {/* Aide */}
        <div className="sitemap-section">
          <h2>Aide & Contact</h2>
          <ul>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/livraison">Livraison & retours</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SiteMap;

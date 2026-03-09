import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./PageSite.scss";

const SiteMap = () => {

  const { t } = useTranslation();

  return (
    <div className="sitemap-page">

      <h1>{t("sitemap.title")}</h1>
      <p>{t("sitemap.description")}</p>

      <div className="sitemap-sections">

        {/* Boutique */}
        <div className="sitemap-section">
          <h2>{t("sitemap.shop")}</h2>
          <ul>
            <li><Link to="/">{t("sitemap.home")}</Link></li>
            <li><Link to="/parfums">{t("sitemap.perfumes")}</Link></li>
            <li><Link to="/categories">{t("sitemap.categories")}</Link></li>
            <li><Link to="/promotions">{t("sitemap.promotions")}</Link></li>
            <li><Link to="/panier">{t("sitemap.cart")}</Link></li>
            <li><Link to="/commande">{t("sitemap.checkout")}</Link></li>
          </ul>
        </div>

        {/* Compte */}
        <div className="sitemap-section">
          <h2>{t("sitemap.account")}</h2>
          <ul>
            <li><Link to="/login">{t("sitemap.login")}</Link></li>
            <li><Link to="/register">{t("sitemap.register")}</Link></li>
            <li><Link to="/profil">{t("sitemap.profile")}</Link></li>
            <li><Link to="/commandes">{t("sitemap.orders")}</Link></li>
          </ul>
        </div>

        {/* Avis */}
        <div className="sitemap-section">
          <h2>{t("sitemap.reviews")}</h2>
          <ul>
            <li><Link to="/avis-clients">{t("sitemap.customerReviews")}</Link></li>
            <li><Link to="/rgpd">{t("sitemap.dataPrivacy")}</Link></li>
            <li><Link to="/rsgp">{t("sitemap.productSafety")}</Link></li>
          </ul>
        </div>

        {/* Informations légales */}
        <div className="sitemap-section">
          <h2>{t("sitemap.legal")}</h2>
          <ul>
            <li><Link to="/cgv">{t("sitemap.cgv")}</Link></li>
            <li><Link to="/mentions-legales">{t("sitemap.legalNotice")}</Link></li>
            <li><Link to="/PolitiqueConfidentialite">{t("sitemap.privacyPolicy")}</Link></li>
            <li><Link to="/SecuriteProduits">{t("sitemap.productSafetyLaw")}</Link></li>
            <li><Link to="/sitemap">{t("sitemap.rgpd")}</Link></li>
          </ul>
        </div>

        {/* Aide */}
        <div className="sitemap-section">
          <h2>{t("sitemap.help")}</h2>
          <ul>
            <li><Link to="/contact">{t("sitemap.contact")}</Link></li>
            <li><Link to="/faq">{t("sitemap.faq")}</Link></li>
            <li><Link to="/livraison">{t("sitemap.delivery")}</Link></li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default SiteMap;

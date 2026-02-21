import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronUp } from "react-icons/fa6";
import "./Footer.scss";
import { Link } from "react-router-dom";
import RatingStars from "../ReviewSection/RatingStars";
import { AvisContext } from "../../context/AvisContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";


export default function Footer() {
  const { avis, loading } = React.useContext(AvisContext); 
  const { t } = useTranslation();

  function toggleSection(id) {

  const element = document.getElementById(id);
  if (!element) return;
  const isOpen = element.style.display === "block";
  element.style.display = isOpen ? "none" : "block";
}


const averageRating =
  avis.reduce((sum, c) => sum + c.rating, 0) / avis.length || 0;


  return (
    <footer id="Footer">
      <div className="footer">
      <div>
      <h3>{t("footer.info")}</h3>
      <ul className="footer__ul">
 
        <li>
          <a href="/sitemap" className="TitreH3">
            {t("footer.sitemap")}
          </a>
        </li>
        <li>
          <a href="" className="TitreH3">
            {t("footer.newPerfume")}
          </a>
        </li>

  <li className="TitreH3" onClick={() => toggleSection("section1")}>
 {t("footer.stores")} 
  <div id="section1" style={{ display: "none", marginTop: "8px" }}>
  
    <a
      href="https://www.google.com/maps?q=287+Rue+Pyrénées,+Paris"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "inherit", textDecoration: "none" }}
    >   <FontAwesomeIcon icon={faLocationDot} />{" "}  Av. Francisco Sá Carneiro, 8125-507 Quarteira, Portugal 
    </a>
  </div>
</li>
      </ul>
      </div>

       <div>
  <h3>{t("footer.conditions")}</h3>
      <ul className="footer__ul">
        <li>
           <Link to="/PolitiqueCookies" rel="noopener noreferrer">{t("footer.cookiesPolicy")}
           </Link>
          </li>
          <li>
          <Link to="/mentions-legales"> {t("footer.legalNotice")}</Link>
        </li>
        <li><Link to="/CGV">{t("footer.terms")} Conditions Générales de Vente</Link></li>
        <li><Link to="/PolitiqueConfidentialite"> Politique de Confidentialite</Link></li>
      </ul>
       </div>

        <div>
       <h3>{t("footer.help")}</h3>
      <ul className="footer__ul">
        <a href="../FAQ" rel="noreferrer noopener">
          <li>{t("footer.faq")}</li>
        </a>
      
          <a href="/QuiSommesNous" rel="noreferrer noopener">
            <li>{t("footer.whoWeAre")}</li>
          </a>
       
        <a href="../Contact" rel="noopener noreferrer">
          <li>{t("footer.contact")}</li>
        </a>
      </ul>
        </div>

        <div> 
       <h3>{t("footer.followUs")}</h3>
      <ul className="footer__ul">
        <li>
          {t("footer.phone")} : +351 920 730 799
        </li>
        <li>
          {t("footer.facebook")}
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer noopener"></a>
        </li>
        <li>
          {t("footer.instagram")}
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer noopener"></a>
        </li>
        <li>
          {t("footer.linkedin")}
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer noopener"></a>
        </li>
        <li>
          {t("footer.tiktok")}
          <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer noopener"></a>
        </li>
      </ul>
       </div>
  
                    {/* <LanguageSwitcher /> */}
     
  
      <div className="footer__ul">
            <h3> NOS RÉCOMPENSES</h3>
           <Link to="/avis-clients" className="footer__logo"> 
          <RatingStars rating={4.5} totalReviews={128} /> 
           {/*    <RatingStars rating={averageRating.toFixed(1)} totalReviews={comments.length} />*/}
        </Link>
       </div> 
       
      </div>
        <a className="fa" title={t("footer.goTop")} href="/home">
        <FaChevronUp id="toTop" />
      </a>
      <div>        <h3>© 2024 MyPerfume. © 2025 Tous droits réservés</h3></div>             
{/** {t("footer.allRights")} **/}
    </footer>
  );
}

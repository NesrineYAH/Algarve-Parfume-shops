import React from "react";
import { useTranslation } from "react-i18next";
import { FaChevronUp } from "react-icons/fa6";
import "./Footer.scss";
import { Link } from "react-router-dom";
export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">

      <div>
      <h3>{t("footer.about")}</h3>
      <ul className="footer__ul">
        <li>
          <a href="../AboutUs/#aboutus" className="TitreH3">
            {t("footer.ourStory")}
          </a>
        </li>
        <li>
          <a href="../AboutUs/#aboutus" className="TitreH3">
            {t("footer.careers")}
          </a>
        </li>
        <li>
          <a href="../AboutUs/#aboutus" className="TitreH3">
            {t("footer.press")}
          </a>
        </li>
        <li>
          <a href="../AboutUs/#aboutus" className="TitreH3">
            {t("footer.socialResponsibility")}
          </a>
        </li>
        <li>
          <a href="../AboutUs/#aboutus" className="TitreH3">
            {t("footer.blog")}
          </a>
        </li>
      </ul>
     </div> 

     <div>
      <h3>{t("footer.info")}</h3>
      <ul className="footer__ul">
 
        <li>
          <a href="../../SiteMap/#sitemap" className="TitreH3">
            {t("footer.sitemap")}
          </a>
          
        </li>
        
    
        <li>
          <a href="" className="TitreH3">
            {t("footer.newPerfume")}
          </a>
        </li>
        <li>
          <a href="../MentionLegales/#mentionsLegales" className="TitreH3">
            {t("footer.faceCare")}
          </a>
        </li>
        <li>
          <a href="../MentionLegales/#mentionsLegales" className="TitreH3">
            {t("footer.stores")}
          </a>
        </li>
        <li>
          <a href="../MentionLegales/#mentionsLegales" className="TitreH3">
            {t("footer.beautyGuide")}
          </a>
        </li>
        <li>
          <a href="../MentionLegales/#mentionsLegales" className="TitreH3">
            {t("footer.perfumeGuide")}
          </a>
        </li>
      </ul>
      </div>

       <div>
  <h3>{t("footer.conditions")}</h3>
      <ul className="footer__ul">
        <li>{t("footer.cookiesPolicy")}</li>
            <li>
          <Link to="/mentions-legales"> {t("footer.legalNotice")}</Link>
        </li>
        <li>{t("footer.cookiesPolicy")}</li>
      
        <li><Link to="/CGV">{t("footer.terms")} Conditions Générales de Vente</Link></li>
        <li><Link to="/PolitiqueConfidentialite">{t("footer.gdpr")} Politique de Confidentialité</Link></li>
        <li>{t("footer.rsgp")}</li>
      </ul>
       </div>

        <div>
       <h3>{t("footer.help")}</h3>
      <ul className="footer__ul">
        <a href="../FAQ" target="_blank" rel="noreferrer noopener">
          <li>{t("footer.faq")}</li>
        </a>
        <li>
          {t("footer.whoWeAre")}
          <a href="" title="facebook" target="_blank" rel="noreferrer noopener"></a>
        </li>
        <a href="../Contact" target="_blank" rel="noopener noreferrer">
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

      <a className="fa" title={t("footer.goTop")} href="/home">
        <FaChevronUp id="toTop" />
      </a>
    </footer>
  );
}

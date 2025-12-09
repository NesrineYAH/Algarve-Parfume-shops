import React from "react";
// import { useTranslation } from "react-i18next";
import { FaChevronUp } from "react-icons/fa6";
import "./Footer.scss";
import FAQ from "../../pages/FAQ/FAQ";

export default function Footer() {
  //  const { t } = useTranslation();
  //  const lang = localStorage.getItem("i18nextLang");

  return (
    <footer className="footer">
      <ul className="footer__ul">
        À propos de nous
        <li>
          <a
            href={`../AboutUs/#aboutus`}
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Notre histoire
          </a>
        </li>
        <li>
          <a
            href={`../AboutUs/#aboutus`}
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Carrières
          </a>
        </li>
        <li>
          <a
            href={`../AboutUs/#aboutus`}
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Presse
          </a>
        </li>
        <li>
          <a
            href={`../AboutUs/#aboutus`}
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Responsabilité sociale
          </a>
        </li>
        <li>
          <a
            href={`../AboutUs/#aboutus`}
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Blog
          </a>
        </li>
      </ul>

      <ul className="footer__ul">
        Informations
        <li>
          <a
            href={`../../SiteMap/#sitemap`}
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Plan de site
          </a>
        </li>
        <li>
          <a
            href={`../MentionLegales/#mentionsLegales`}
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Mentiens Legales
          </a>
        </li>
        <li>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Nouveauté parfum
          </a>
        </li>
        <li>
          <a
            href={`../MentionLegales/#mentionsLegales`}
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Soin visage
          </a>
        </li>
        <li>
          <a
            href={`../MentionLegales/#mentionsLegales`}
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Nos magasins
          </a>
        </li>
        <li>
          <a
            href={`../MentionLegales/#mentionsLegales`}
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Guide d'achats beauté
          </a>
        </li>
        <li>
          <a
            href={`../MentionLegales/#mentionsLegales`}
            target="_blank"
            rel="noopener noreferrer"
            className="TitreH3"
          >
            Guide parfums
          </a>
        </li>
      </ul>
      <ul className="footer__ul">
        Conditions
        <li>Politique Cookies</li>
        <li>Mentions légales</li>
        <li>Politique Cookies</li>
        <li>CGV</li>
        <li>RGBP</li>
        <li>RSGP</li>
      </ul>

      <ul className="footer__ul">
        Besoin d'Aide
        <a href={"../FAQ"} target="_blank" rel="noreferrer noopener">
          <li>FAQ</li>
        </a>
        <li>
          Qui somme nous
          <a
            href=""
            title="facebook"
            target="_blank"
            rel="noreferrer noopener"
          ></a>
        </li>
              
                    <a href={"../Contact"} target="_blank" rel="noopener noreferrer">
                        <li>
                        Contact
                    </li>
                    </a>
                
      </ul>

      <ul className="footer__ul">
        Suivez-nous
        <li>
          Tel : 075844851252
          <a href=""></a>
        </li>
        <li>
          Facebook
          <a
            href="https://www.facebook.com/"
            title="facebook"
            target="_blank"
            rel="noreferrer noopener"
          ></a>
        </li>
        <li>
          Instagrame
          <a
            href="https://www.facebook.com/"
            title="facebook"
            target="_blank"
            rel="noreferrer noopener"
          ></a>
        </li>
        <li>
          LinkedIn
          <a
            href="https://www.facebook.com/"
            title="facebook"
            target="_blank"
            rel="noreferrer noopener"
          ></a>
        </li>
        <li>
          TikTok
          <a
            href="https://www.facebook.com/"
            title="facebook"
            target="_blank"
            rel="noreferrer noopener"
          ></a>
        </li>
      </ul>

      <a className="fa" title="Go to top" href="/home">
        <FaChevronUp id="toTop " />
      </a>
    </footer>
  );
}

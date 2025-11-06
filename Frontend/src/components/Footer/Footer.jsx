import React from 'react';
// import { useTranslation } from "react-i18next";
 import { FaChevronUp } from "react-icons/fa6";
 import './Footer.scss';


export default function Footer() {

//  const { t } = useTranslation();
//  const lang = localStorage.getItem("i18nextLang");

  return (
    <footer className="footer">

      <div className='footer__link'>
           <h3>
            <a href={`../../SiteMap/#sitemap`} target="_blank" rel="noopener noreferrer" className='TitreH3'>Plan de site</a>
            </h3>  
             || 
         <h3>
        <a href={`../MentionLegales/#mentionsLegales`} target="_blank" rel="noopener noreferrer" className='TitreH3'>Mentiens Legales</a>
        </h3> 
      </div>
    <ul className='footer__ul'>
        <li>
            <a href='' target="_blank" rel="noopener noreferrer" className='TitreH3'>Nouveauté parfum</a>
        </li>   
         <li>
        <a href={`../MentionLegales/#mentionsLegales`} target="_blank" rel="noopener noreferrer" className='TitreH3'>Soin visage</a>
        </li> 
        <li>
        <a href={`../MentionLegales/#mentionsLegales`} target="_blank" rel="noopener noreferrer" className='TitreH3'>Nos magasins</a>
        </li> 
        <li>
        <a href={`../MentionLegales/#mentionsLegales`} target="_blank" rel="noopener noreferrer" className='TitreH3'>Guide d'achats beauté</a>
        </li> 
          <li>
        <a href={`../MentionLegales/#mentionsLegales`} target="_blank" rel="noopener noreferrer" className='TitreH3'>Guide parfums</a>
        </li> 
      </ul>
          <ul className='footer__ul'>Conditions
            <li>Politique Cookies</li>
            <li>Mentions légales</li>
            <li>Politique Cookies</li>
            <li>CGV</li>
            <li>RGBP</li>
            <li>RSGP</li>
          </ul>
               <ul className='footer__ul'>Suivez-nous Aide
        <ul>
					<li>
									<a href="https://www.instagram.com/" title="instagram" target="_blank" rel="noreferrer noopener" class="">
						<i class="icon-instagram"></i>
					</a>
							</li>
					<li>
									<a href="https://www.facebook.com/" title="facebook" target="_blank" rel="noreferrer noopener" class="">
						<i class="icon-facebook"></i>
					</a>
							</li>
			</ul>
          </ul>
      <a className="fa" title="Go to top" href="/home">
      <FaChevronUp id="toTop "/>
      </a>
    </footer>
  );
}
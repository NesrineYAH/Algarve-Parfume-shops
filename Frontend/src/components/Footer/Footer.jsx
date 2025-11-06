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
  
      <a className="fa" title="Go to top" href="/home">
      <FaChevronUp id="toTop "/>
      </a>
    </footer>
  );
}
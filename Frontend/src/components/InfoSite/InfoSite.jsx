import React from "react";
import "./InfoSite.scss";
import {FaLinkedin,FaPinterest,FaTiktok,
  FaFacebook, FaPaypal, FaCcVisa, FaCcMastercard, FaCreditCard} from "react-icons/fa";

 //import { SiMondialrelay } from "react-icons/si";


const InfoSite = () => {
  const iconsPayements = [
    { name: "PayPal", src: "/images/icons/Paypal.png" },
    { name: "Mastercard", src: "/images/icons/mastercard.png" },
    { name: "VISA", src: "/images/icons/visa.png" },
    { name: "Carte Bancaire", src: "/images/icons/CB.png" },
  ];
  const iconsDelivry = [
    { name: "MondialRelay", src: "/images/icons/Mondial-relay.png" },
    { name: "Mastercard", src: "/images/icons/colis-prive.jpg" },
  ];
  return (
    <div className="infoSite">
      <div className="infoSite__section">
        <h3>Nos moyens de paiement</h3>
      <div className="infoSite__icons">
      <FaPaypal title="PayPal" className="icone"/>
      <FaCcVisa title="Visa" className="icone"/>
      <FaCcMastercard title="MasterCard" className="icone"/>
      <FaCreditCard title="Carte bancaire" className="icone"/>
      </div>
    </div>

     <div className="infoSite__section">
        <h3>Nos Applications Mobiles</h3>
      <div className="infoSite__icons">
        <a href="https://www.linkedin.com/in/parfume-algarve-aa3474382"> <FaLinkedin title="LinkedIn" className="icone"/></a>
     
<a href="https://fr.pinterest.com/parfumealgrave/">      <FaPinterest title="Pinterest" className="icone"/> </a>

      <FaTiktok title="TikTok" className="icone" />
      <FaFacebook title="Facebook" className="icone" />
      </div>   
     </div>
      </div>
  
  );
};

export default InfoSite;

  /*
      <div className="infoSite__section">
        <h3>Nos partenaires de livraison</h3>
        <div className="infoSite__icons">
          <a
            href="https://www.mondialrelay.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={"/images/icons/Mondial-relay.png"}
              alt="icone Modial Relay"
            />
          </a>
          <a
            href="https://colisprive.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={"/images/icons/colis-prive.png"}
              alt="icone Colis Privé"
              className="icone"
            />
          </a>
        </div>
      </div>

      <div className="infoSite__section">
        <h3>Nos Applications Mobile</h3>
        <div className="app-links">
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/icons/appI.png"
              alt="Google Play apps.web"
              className="icone"
            />
               <img
              src="/images/icons/appII.png"
              alt="Google Play apps.web"
              className="icone"
            />
          </a>
        </div>
      </div>

      <div className="infoSite__section">
        <h3>Retrouvez nous sur</h3>
        <div className="infoSite__icons">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/icons/facebook.png"
              alt="Facebook"
              className="icone"
            />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/icons/instagram.png"
              alt="Instagram"
              className="icone"
            />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/icons/pinterest.png"
              alt="Pinterest"
              className="icone"
            />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/icons/tiktok.jpg"
              alt="TikTok"
              className="icone"
            />
          </a>
        </div>
      </div>
      */
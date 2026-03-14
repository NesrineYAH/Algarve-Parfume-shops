import React from "react";
import "./InfoSite.scss";
import {FaLinkedin,FaPinterest,FaTiktok,
  FaFacebook, FaPaypal, FaCcVisa, FaCcMastercard, FaCreditCard} from "react-icons/fa";


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

 
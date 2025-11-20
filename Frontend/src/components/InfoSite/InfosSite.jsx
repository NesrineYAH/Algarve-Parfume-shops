import React from "react";
import "./InfoSite.scss";

const InfoSite = () => {
  const icons = [
    { name: "PayPal", src: "/assets/icons/paypal.png" },
    { name: "Mastercard", src: "/assets/icons/mastercard.png" },
    { name: "VISA", src: "/assets/icons/visa.png" },
    { name: "Carte Bancaire", src: "/assets/icons/CB.png" },
  ];
  return (
    <div className="infoSite">
      <div className="infoSite__section">
        <h3>Nos moyens de paiement</h3>
        <div className="infoSite__icons">
          <img src="../../assets/icons/Paypal.png" alt="PayPal" />
          <img src="../../assets/icons/mastercard.png" alt="Mastercard" />
          <img src="../../assets/icons/visa.png" alt="VISA" />
          <img src="../../assets/icons/cb.png" alt="CB" />
        </div>
      </div>

      <div className="infoSite__section">
        <h3>Nos partenaires de livraison</h3>
        <div className="infoSite__icons">
          <img src="/icons/chronopost.png" alt="Chronopost" />
          <img src="/icons/mondial-relay.png" alt="Mondial Relay" />
          <img src="/icons/colis-prive.png" alt="Colis Privé" />
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
            <img src="/icons/google-play.png" alt="Google Play" />
          </a>
          <a
            href="https://www.apple.com/app-store/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/app-store.png" alt="App Store" />
          </a>
        </div>
      </div>

      <div className="infoSite__section">
        <h3>Retrouvez nous sur</h3>
        <div className="infoSie__icons">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/facebook.png" alt="Facebook" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/instagram.png" alt="Instagram" />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/pinterest.png" alt="Pinterest" />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/tiktok.png" alt="TikTok" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/youtube.png" alt="YouTube" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default InfoSite;

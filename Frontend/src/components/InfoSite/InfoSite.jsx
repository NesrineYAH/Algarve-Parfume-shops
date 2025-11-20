import React from "react";
import "./InfoSite.scss";

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
          <div className="infoSite__icons">
            <a
              href="https://www.paypal.com/fr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/icons/Paypal.png" alt="PayPal" />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer">
              <img src="/images/icons/mastercard.png" alt="Mastercard" />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer">
              <img src="/images/icons/visa.webp" alt="VISA" />
            </a>

            <a href="" target="_blank" rel="noopener noreferrer">
              <img src="/images/icons/CB.png" alt="CB" />
            </a>
          </div>
        </div>
      </div>

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
              src="/images/icons/apps.png"
              alt="Google Play apps.web"
              className="icone"
            />
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
    </div>
  );
};

export default InfoSite;

import React from "react";
import "./InfoSite.css"; // Pour les styles

const paymentIcons = [
  { name: "PayPal", src: "/assets/icons/paypal.png" },
  { name: "Mastercard", src: "/assets/icons/mastercard.png" },
  { name: "VISA", src: "/assets/icons/visa.png" },
  { name: "Carte Bancaire", src: "/assets/icons/CB.png" },
];

const InfoSite = () => {
  return (
    <div className="info-site">
      <h3>Nos moyens de paiement</h3>
      <div className="payment-section">
        {paymentIcons.map((icon) => (
          <div key={icon.name} className="payment-icon">
            <img src={icon.src} alt={icon.name} />
            <span>{icon.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSite;

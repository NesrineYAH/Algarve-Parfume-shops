import React, { useState } from "react";
import "./Delivery.scss";

export default function Delivery({ onDeliveryChange }) {
  const [selectedOption, setSelectedOption] = useState("domicile");
  const [address, setAddress] = useState("");

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (onDeliveryChange) {
      onDeliveryChange({ type: value, address });
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    if (onDeliveryChange) {
      onDeliveryChange({ type: selectedOption, address: value });
    }
  };

  return (
    <div className="delivery-container">
      <h2>📦 Choisissez votre mode de livraison</h2>

      <div className="delivery-options">
        <label>
          <input
            type="radio"
            value="domicile"
            checked={selectedOption === "domicile"}
            onChange={handleOptionChange}
          />
          À domicile (entre le lundi 04 et le mardi 05 déc.)
        </label>

        <label>
          <input
            type="radio"
            value="magasin"
            checked={selectedOption === "magasin"}
            onChange={handleOptionChange}
          />
          En magasin (entre le lundi 04 et le mardi 05 déc.)
        </label>

        <label>
          <input
            type="radio"
            value="pointRelais"
            checked={selectedOption === "pointRelais"}
            onChange={handleOptionChange}
          />
          En point relais (entre le lundi 04 et le mardi 05 déc.)
        </label>
      </div>

      {selectedOption === "domicile" && (
        <div className="address-section">
          <label>Adresse de livraison :</label>
          <input
            type="text"
            placeholder="8 rue du Faubourg Poissonnière, 75010 Paris"
            value={address}
            onChange={handleAddressChange}
          />
        </div>
      )}

      {selectedOption !== "domicile" && (
        <div className="address-section">
          <label>Adresse de retrait :</label>
          <input
            type="text"
            placeholder="Choisissez un magasin ou point relais"
            value={address}
            onChange={handleAddressChange}
          />
        </div>
      )}
    </div>
  );
}

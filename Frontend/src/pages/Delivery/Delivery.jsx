import React, { useState, useEffect } from "react";
import "./Delivery.scss";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";

export default function Delivery({ onDeliveryChange }) {
  const [selectedOption, setSelectedOption] = useState("domicile");
  const [address, setAddress] = useState("");
  const [relays, setRelays] = useState([]); // liste des points relais
  const [selectedRelay, setSelectedRelay] = useState(null);

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (onDeliveryChange) {
      onDeliveryChange({ type: value, address, relay: selectedRelay });
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    if (onDeliveryChange) {
      onDeliveryChange({
        type: selectedOption,
        address: value,
        relay: selectedRelay,
      });
    }
  };

  const selectRelay = (relay) => {
    setSelectedRelay(relay);
    if (onDeliveryChange) {
      onDeliveryChange({ type: "pointRelais", address, relay });
    }
  };

  // ➤ Géolocalisation pour trouver les relais proches
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude, "Longitude:", longitude);

        // ⚠️ Ici tu devrais appeler une API Mondial Relay ou ton backend
        // pour récupérer les relais proches de ces coordonnées.
        // Exemple fictif :
        setRelays([
          {
            id: 1,
            name: "Relais Paris 10",
            address: "12 rue Lafayette, Paris",
          },
          {
            id: 2,
            name: "Relais Gare du Nord",
            address: "5 rue Dunkerque, Paris",
          },
        ]);
      },
      (error) => {
        console.error("Erreur de localisation :", error);
      }
    );
  }, []);

  return (
    <div className="delivery-container">
      <CheckoutSteps step={3} />

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

      {selectedOption === "pointRelais" && (
        <div className="address-section">
          <label>Choisissez un point relais :</label>
          <div className="relay-list">
            {relays.map((relay) => (
              <div key={relay.id} className="relay-card">
                <h3>{relay.name}</h3>
                <p>{relay.address}</p>
                <button onClick={() => selectRelay(relay)}>
                  Choisir ce relais
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

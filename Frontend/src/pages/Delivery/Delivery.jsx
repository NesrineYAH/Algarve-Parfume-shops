import React, { useState, useEffect, useContext } from "react";
import "./Delivery.scss";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

import { CartContext } from "../../context/CartContext";

// Fix icône Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Delivery({ onDeliveryChange }) {
  const [selectedOption, setSelectedOption] = useState("pointRelais");
  const [address, setAddress] = useState("");
  const [relays, setRelays] = useState([]);
  const [selectedRelay, setSelectedRelay] = useState(null);
  const [position, setPosition] = useState({ lat: 48.865121, lng: 2.404008 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { cartItems } = useContext(CartContext);

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

  const selectRelay = (relay, e) => {
    if (e) e.stopPropagation(); // Important pour les boutons dans Leaflet Popup
    setSelectedRelay(relay);
    if (onDeliveryChange) {
      onDeliveryChange({ type: "pointRelais", address, relay });
    }
  };

  // Mock relais pour test sans backend
  useEffect(() => {
    setLoading(true);
    setError(null);

    const mockRelays = [
      {
        id: "1",
        name: "Relais République",
        address: "12 Rue du Faubourg Saint-Denis",
        city: "Paris",
        zip: "75010",
        lat: 48.8655,
        lng: 2.4045,
      },
      {
        id: "2",
        name: "Relais Gare du Nord",
        address: "5 Rue de Dunkerque",
        city: "Paris",
        zip: "75010",
        lat: 48.867,
        lng: 2.404,
      },
      {
        id: "3",
        name: "Relais Château d’Eau",
        address: "8 Boulevard de Strasbourg",
        city: "Paris",
        zip: "75010",
        lat: 48.8647,
        lng: 2.403,
      },
      {
        id: "4",
        name: "Relais Louis Blanc",
        address: "10 Rue Louis Blanc",
        city: "Paris",
        zip: "75010",
        lat: 48.866,
        lng: 2.405,
      },
    ];

    setTimeout(() => {
      setRelays(mockRelays);
      setLoading(false);
    }, 500); // simulate API delay
  }, []);
  // handleFinalize 
  const handleFinalize = async () => {
  const preOrderId = localStorage.getItem("preOrderId");
  if (!preOrderId) return;

  await OrderService.finalizeOrder(preOrderId);

  localStorage.removeItem("cart");
  localStorage.removeItem("preOrderId");

  navigate("/confirmation");
};

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
          À domicile
        </label>

        <label>
          <input
            type="radio"
            value="magasin"
            checked={selectedOption === "magasin"}
            onChange={handleOptionChange}
          />
          En magasin
        </label>

        <label>
          <input
            type="radio"
            value="pointRelais"
            checked={selectedOption === "pointRelais"}
            onChange={handleOptionChange}
          />
          En point relais
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

          {loading && <p className="loading">Chargement des points relais…</p>}
          {error && <p className="error">{error}</p>}

          <div
            className="map-section"
            style={{ height: "400px", margin: "10px 0" }}
          >
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {relays.map((relay) => (
                <Marker
                  key={relay.id}
                  position={[relay.lat, relay.lng]}
                  eventHandlers={{ click: () => selectRelay(relay) }}
                >
                  <Popup>
                    <div>
                      <strong>{relay.name}</strong>
                      <br />
                      {relay.address}, {relay.zip} {relay.city}
                      <br />
                      <button onClick={(e) => selectRelay(relay, e)}>
                        Choisir ce relais
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="relay-list">
            {relays.map((relay) => (
              <div
                key={relay.id}
                className={`relay-card ${
                  selectedRelay?.id === relay.id ? "selected" : ""
                }`}
              >
                <h3>{relay.name}</h3>
                <p>{relay.address}</p>
                <button onClick={() => selectRelay(relay)}>
                  Choisir ce relais
                </button>
                <Link to="/payment" state={{ cart: cartItems }}>
                  <button className="Button">Passer au paiement</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

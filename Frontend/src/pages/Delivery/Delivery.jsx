import React, { useState, useEffect } from "react";
import "./Delivery.scss";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";
import { getRelays } from "../../Services/deliveryService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icône Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Delivery({ onDeliveryChange }) {
  const [selectedOption, setSelectedOption] = useState("domicile");
  const [address, setAddress] = useState("");
  const [relays, setRelays] = useState([]);
  const [selectedRelay, setSelectedRelay] = useState(null);
  const [position, setPosition] = useState({ lat: 48.865149, lng: 2.403761 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        console.log("Latitude:", latitude, "Longitude:", longitude);

        try {
          setLoading(true);
          setError(null);
          const relaysData = await getRelays(latitude, longitude);
          setRelays(relaysData);
        } catch (err) {
          console.error("Erreur lors de la récupération des relais :", err);
          setError("Impossible de récupérer les points relais.");
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        console.error("Erreur de localisation :", geoError);
        setError("La géolocalisation est refusée ou indisponible.");
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
                      <button onClick={() => selectRelay(relay)}>
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/*
export default function Delivery({ onDeliveryChange }) {
  const [selectedOption, setSelectedOption] = useState("domicile");
  const [address, setAddress] = useState("");
  const [relays, setRelays] = useState([]); // liste des points relais
  const [selectedRelay, setSelectedRelay] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  //26/11
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setPosition({ lat, lng });

      const resp = await axios.get("/api/delivery/relays", {
        params: { lat, lng },
      });

      setRelays(resp.data.relays);
    });
  };

  // ➤ Géolocalisation pour trouver les relais proches via backend
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude, "Longitude:", longitude);

        try {
          setLoading(true);
          setError(null);
          const relaysData = await getRelays(latitude, longitude);
          setRelays(relaysData);
        } catch (err) {
          console.error("Erreur lors de la récupération des relais :", err);
          setError("Impossible de récupérer les points relais.");
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        console.error("Erreur de localisation :", geoError);
        setError("La géolocalisation est refusée ou indisponible.");
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

          {loading && <p className="loading">Chargement des points relais…</p>}
          {error && <p className="error">{error}</p>}

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
*/

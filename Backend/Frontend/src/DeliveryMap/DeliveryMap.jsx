import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correction icône Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DeliveryMap = ({ latitude, longitude, onSelectRelay }) => {
  const [relays, setRelays] = useState([]);

  useEffect(() => {
    const fetchRelays = async () => {
      try {
        const res = await fetch(`/api/delivery/relays?lat=${latitude}&lng=${longitude}`);
        const data = await res.json();
        setRelays(data.relays || []);
      } catch (err) {
        console.error("Erreur récupération relais :", err);
      }
    };

    if (latitude && longitude) fetchRelays();
  }, [latitude, longitude]);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={14}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {relays.map((relay) => (
        <Marker
          key={relay.id}
          position={[relay.lat, relay.lng]}
          eventHandlers={{
            click: () => onSelectRelay(relay),
          }}
        >
          <Popup>
            <div>
              <strong>{relay.name}</strong>
              <br />
              {relay.address}, {relay.zip} {relay.city}
              <br />
              <button
                onClick={() => onSelectRelay(relay)}
                style={{ marginTop: "5px" }}
              >
                Choisir ce relais
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DeliveryMap;

import { useState } from "react";
import axios from "axios";

export default function Delivery() {
  const [position, setPosition] = useState(null);
  const [relays, setRelays] = useState([]);
  const [selectedRelay, setSelectedRelay] = useState(null);

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

  return (
    <div>
      <h2>Choisir un point relais</h2>

      <button onClick={getLocation}>Trouver les points relais proches</button>

      {relays.length > 0 && (
        <ul>
          {relays.map((relay) => (
            <li
              key={relay.Num}
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
                cursor: "pointer",
                background: selectedRelay?.Num === relay.Num ? "#def" : "",
              }}
              onClick={() => setSelectedRelay(relay)}
            >
              <strong>{relay.Libel}</strong>
              <br />
              {relay.Adresse1}
              <br />
              {relay.CP} {relay.Ville}
            </li>
          ))}
        </ul>
      )}

      {selectedRelay && (
        <div style={{ marginTop: 20 }}>
          <h3>Point relais sélectionné :</h3>
          <p>{selectedRelay.Libel}</p>
          <p>{selectedRelay.Adresse1}</p>
          <p>
            {selectedRelay.CP} {selectedRelay.Ville}
          </p>
        </div>
      )}
    </div>
  );
}

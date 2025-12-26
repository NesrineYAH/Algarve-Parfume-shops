import React, { useState } from "react";
import "./AddressAutocomplete.scss";

export default function AddressAutocomplete({ value, onChange, onSelect }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const query = e.target.value;

    // 🔥 PERMET D'ÉCRIRE
    onChange(query);

    if (query.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: query,
            format: "json",
            countrycodes: "pt",
            addressdetails: "1",
            limit: "5",
          })
      );

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Erreur autocomplete adresse", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    onSelect(item.display_name);
    setResults([]);
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        placeholder="Rua Exemplo 12, 8000 Faro, Portugal"
        value={value}
        onChange={handleChange}
      />

      {loading && <div className="loading">Recherche…</div>}

      {results.length > 0 && (
        <ul className="autocomplete-list">
          {results.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item)}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

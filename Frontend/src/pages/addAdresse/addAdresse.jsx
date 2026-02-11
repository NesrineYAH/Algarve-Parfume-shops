import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../admin/admin.scss';

export default function AddAdresse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
    type: "shipping",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
      
        },
     credentials: "include",
        body: JSON.stringify(form), // userId sera normalement ajouté côté backend
      });

      const text = await response.text();

      if (!response.ok) {
        alert(`Erreur ${response.status} : ${text}`);
        return;
      }

      alert("Adresse ajoutée avec succès !");
      navigate("/MonCompte");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’ajout de l'adresse.");
    }
  };

  return (
    <div className="addAresse">
      <h3>Ajouter une nouvelle adresse</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Rue"
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Ville"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Code postal"
          value={form.postalCode}
          onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Pays"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          required
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="shipping">Livraison</option>
          <option value="billing">Facturation</option>
        </select>

        <button type="submit">Ajouter l'adresse</button>
      </form>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MonCompte.scss";

export default function MonCompte() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
    type: "shipping",
  });

  // Vérifier si l'utilisateur est connecté et récupérer ses infos
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Authentification");
      return;
    }

    const storedUser = {
      nom: localStorage.getItem("nom") || "John",
      prenom: localStorage.getItem("prenom") || "Doe",
      email: localStorage.getItem("email") || "johndoe@example.com",
      role: localStorage.getItem("role") || "client",
    };
    setUser(storedUser);

    // Charger les adresses existantes
    fetch("/api/addresses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAddresses(data))
      .catch((err) => console.error(err));
  }, [navigate]);

  if (!user) return null;

  // Ajouter une nouvelle adresse
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const response = await fetch("/api/addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    alert(data.message);

    // Mettre à jour la liste des adresses
    if (data.address) setAddresses([...addresses, data.address]);

    // Réinitialiser le formulaire
    setForm({
      street: "",
      city: "",
      postalCode: "",
      country: "",
      type: "shipping",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nom");
    localStorage.removeItem("prenom");
    localStorage.removeItem("email");
    navigate("/Authentification");
  };

  return (
    <div className="moncompte-container">
      <h1>
        Bienvenue, {user.prenom} {user.nom} !
      </h1>

      <div className="user-info">
        <p>
          <strong>Nom :</strong> {user.nom}
        </p>
        <p>
          <strong>Prénom :</strong> {user.prenom}
        </p>
        <p>
          <strong>Email :</strong> {user.email}
        </p>
        <p>
          <strong>Rôle :</strong> {user.role}
        </p>
      </div>

      <div className="profil-actions">
        <button onClick={() => navigate("/orders")}>Mes Commandes</button>
        <button onClick={() => navigate("/history")}>
          Historique d'Achats
        </button>
        <button onClick={handleLogout}>Déconnexion</button>
      </div>

      <div className="addresses-section">
        <h2>Mes Adresses</h2>

        <ul>
          {addresses.map((addr) => (
            <li key={addr._id}>
              {addr.street}, {addr.city}, {addr.postalCode}, {addr.country} (
              {addr.type})
            </li>
          ))}
        </ul>

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
    </div>
  );
}

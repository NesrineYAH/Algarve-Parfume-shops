import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MonCompte.scss";

export default function MonCompte() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("infos");

  // Charger l'utilisateur + ses adresses
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/Authentification");
      return;
    }

    // Charger infos utilisateur
    const storedUser = {
      nom: localStorage.getItem("nom"),
      prenom: localStorage.getItem("prenom"),
      email: localStorage.getItem("email"),
      role: localStorage.getItem("role"),
    };

    setUser(storedUser);

    // Charger adresses
    fetch("/api/addresses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAddresses(data))
      .catch((err) => console.error("Erreur chargement adresses :", err));
  }, [navigate]);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Authentification");
  };
  //24/11
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <section className="moncompte">
      <div>
        {" "}
        <h1>Mon Compte</h1>
        <h2>
          Bienvenue, {user.prenom} {user.nom} !
        </h2>
      </div>

      <div className="moncompte__layout">
        <aside className="moncompte__sidebar">
          <button onClick={() => handleTabClick("infos")}>
            Mes Informations
          </button>
          <button onClick={() => handleTabClick("addresses")}>
            Mes Adresses
          </button>
          <button onClick={() => handleTabClick("orders")}>
            Mes Commandes
          </button>
          <button onClick={() => handleTabClick("favorites")}>
            Mes Favoris
          </button>
          <button onClick={() => handleTabClick("payments")}>
            Mes Moyens de Paiement
          </button>
          <button onClick={handleLogout}>Déconnexion</button>
        </aside>

        <main className="moncompte__content">
          {activeTab === "infos" && (
            <div>
              <h2>Mes Informations</h2>
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
          )}

          {activeTab === "addresses" && (
            <div>
              <h2>Mes Adresses</h2>
              {addresses.length === 0 ? (
                <p>Aucune adresse enregistrée.</p>
              ) : (
                <ul>
                  {addresses.map((addr) => (
                    <li key={addr._id}>
                      {addr.street}, {addr.city}, {addr.postalCode},{" "}
                      {addr.country} ({addr.type})
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => navigate("/add-adresse")}>
                ➕ Ajouter une adresse
              </button>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2>Mes Commandes</h2>
              <button onClick={() => navigate("/history")}>
                Voir l'historique
              </button>
            </div>
          )}

          {activeTab === "favorites" && <h2>Mes Favoris</h2>}
          {activeTab === "payments" && <h2>Mes Moyens de Paiement</h2>}
        </main>
      </div>
    </section>
  );
}

/*
 {/*}
      <div className="moncompteContainerI">
       

        <div className="moncompteContainerI__info">
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
      </div>

      <div className="moncompteContainerII">
  
        <div className="moncompteContainerII__addresses">
          <button>Mes Addresses</button>

          {addresses.length === 0 ? (
            <p>Aucune adresse enregistrée.</p>
          ) : (
            <ul>
              {addresses.map((addr) => (
                <li key={addr._id}>
                  {addr.street}, {addr.city}, {addr.postalCode}, {addr.country}{" "}
                  ({addr.type})
                </li>
              ))}
            </ul>
          )}
        </div>

     
        <div className="moncompteContainerII__profil">
          <button>Mes Commandes</button>
          <button onClick={() => navigate("/history")}>
            Historique d'Achats
          </button>
          <button onClick={() => navigate("/history")}>Mes Inofrmations</button>

  
          <button onClick={() => navigate("/add-adresse")}>
            ➕ Ajouter une nouvelle adresse
          </button>

          <button>Mes favoris</button>
          <button>Mes moyens de paiement</button>

          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>*/

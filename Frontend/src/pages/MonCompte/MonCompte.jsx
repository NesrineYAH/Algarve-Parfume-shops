// MonCompte.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./MonCompte.scss";
import { UserContext } from "../../context/UserContext";
import { getCurrentUser } from "../../Services/auth";


export default function MonCompte() {
  const navigate = useNavigate();
  const { user, setUser, handleLogout } = useContext(UserContext);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("infos");
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);

  // Charger infos utilisateur + adresses
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Authentification");
      return;
    }


    // ✅ Recharger l’utilisateur depuis l’API /me
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate("/Authentification");
      }
      // ⚠️ Pas besoin de setUser ici, car c’est déjà géré par UserContext
    };
    fetchUser();

    // ✅ Charger adresses
    fetch("http://localhost:5001/api/addresses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAddresses(data))
      .catch((err) => console.error("Erreur chargement adresses :", err));
  }, [navigate]);

  // Charger favoris depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Charger commandes de l’utilisateur
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    // Charger infos utilisateur
    const storedUser = {
      nom: localStorage.getItem("nom"),
      prenom: localStorage.getItem("prenom"),
      email: localStorage.getItem("email"),
      role: localStorage.getItem("role"),
    };

    setUser(storedUser);

    fetch(`http://localhost:5001/api/orders/user/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Erreur chargement commandes :", err));
  }, [user]);

  const handleTabClick = (tabName) => setActiveTab(tabName);

  if (!user) {
    return (
      <section className="moncompte">
        <h2>Chargement du compte...</h2>
      </section>
    );
  }

  return (
    <section className="moncompte">
      <div>
        <h1>Mon Compte</h1>
        <h2>
          Bienvenue, {user.prenom} {user.nom} !
        </h2>
      </div>

      <div className="moncompte__layout">
        <aside className="moncompte__sidebar">
          <button onClick={() => handleTabClick("infos")}>Mes Informations</button>
          <button onClick={() => handleTabClick("addresses")}>Mes Adresses</button>
          <button onClick={() => handleTabClick("orders")}>Mes Commandes</button>
          <button onClick={() => handleTabClick("favorites")}>Mes Favoris</button>
          <button onClick={() => handleTabClick("payments")}>Mes Moyens de Paiement</button>
          <button onClick={handleLogout}>Déconnexion</button>
        </aside>

        <main className="moncompte__content">
          {activeTab === "infos" && (
            <div>
              <h2>Mes Informations</h2>
              <p><strong>Nom :</strong> {user.nom}</p>
              <p><strong>Prénom :</strong> {user.prenom}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Rôle :</strong> {user.role}</p>
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
                      {addr.street}, {addr.city}, {addr.postalCode}, {addr.country} ({addr.type})
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => navigate("/add-adresse")}>➕ Ajouter une adresse</button>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2>Mes Commandes</h2>
              {orders.length === 0 ? (
                <p>Aucune commande trouvée.</p>
              ) : (
                <ul>
                  {orders.map((order) => (
                    <li key={order._id}>
                      Commande #{order._id} - {order.status} - {order.total} €
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h2>Mes Favoris</h2>
              {favorites.length === 0 ? (
                <p>Aucun produit favori.</p>
              ) : (
                <ul>
                  {favorites.map((prod) => (
                    <li key={prod._id}>
                      {prod.nom} - {prod.prix} €
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "payments" && <h2>Mes Moyens de Paiement</h2>}
        </main>
      </div>
    </section>
  );
}

/*
export default function MonCompte() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("infos");
  const [favorites, setFavorites] = useState([]);

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

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");
    localStorage.removeItem("token");
    navigate("/Authentification");
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  if (!user) {
    return (
      <section className="moncompte">
        <h2>Chargement du compte...</h2>
      </section>
    );
  }

  return (
    <section className="moncompte">
      <div>
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
              <button onClick={() => navigate("/Orders")}>
                Voir l'historique
              </button>
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h2>Mes Favoris</h2>
              {favorites.length === 0 ? (
                <p>Aucun produit favori.</p>
              ) : (
                <ul>
                  {favorites.map((prod) => (
                    <li key={prod._id}>
                      {prod.nom} - {prod.prix} €
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "payments" && <h2>Mes Moyens de Paiement</h2>}
        </main>
      </div>
    </section>
  );
}
*/
// Frontend/src/pages/MonCompte/MonCompte.jsx
/* Frontend/src/pages/MonCompte/MonCompte.jsx */
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MonCompte.scss";
import { UserContext } from "../../context/UserContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import { Heart, Trash2 } from "lucide-react";

export default function MonCompte() {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("infos");
  const [orders, setOrders] = useState([]);

  /* 🔐 1) Vérification auth + chargement adresses */
  useEffect(() => {
    // Si pas connecté → redirection immédiate
    if (!user) {
      navigate("/Authentification");
      return;
    }

    // Charger les adresses via cookie JWT
    fetch("http://localhost:5001/api/addresses", {
      method: "GET",
      credentials: "include",   // ⭐ indispensable
    })
      .then(res => res.json())
      .then(setAddresses)
      .catch(console.error);
  }, [user, navigate]);

  /* 📦 2) Commandes */
  useEffect(() => {
    if (!user?._id) return;

    fetch(`http://localhost:5001/api/orders/user/${user._id}`, {
      method: "GET",
      credentials: "include",   // ⭐ indispensable
    })
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(console.error);
  }, [user]);

  /* 🚀 3) Redirection ADMIN / VENDEUR */
  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "vendeur")) {
  navigate("/admin");

    }
  }, [user, navigate]);

  if (!user) {
    return <h2>Chargement du compte...</h2>;
  }




  return (
    <section className="moncompte">
      <h1>Mon Compte</h1>
      <h2>Bienvenue, {user.prenom} {user.nom}</h2>

      <div className="moncompte__layout">
        <aside className="moncompte__sidebar">
          <button onClick={() => setActiveTab("infos")}>Infos</button>
          <button onClick={() => setActiveTab("addresses")}>Adresses</button>
          <button onClick={() => setActiveTab("orders")}>Commandes</button>
          <button onClick={() => setActiveTab("favorites")}>Favoris</button>
          {/* <Link to="/paymentMethods">Moyens de paiement</Link> */}
           <button onClick={() => navigate("/paymentMethods")}>Moyens de paiement</button>
          <button onClick={handleLogout}>Déconnexion</button>
        </aside>

        <main className="moncompte__content">
          {activeTab === "infos" && (
            <>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Rôle :</strong> {user.role}</p>
            </>
          )}

          {activeTab === "addresses" && (
            <>
              {addresses.map(addr => (
                <li key={addr._id}>
                  {addr.street}, {addr.city}
                </li>
              ))}
              <button onClick={() => navigate("/add-adresse")}>
                ➕ Ajouter une adresse
              </button>
            </>
          )}

          {activeTab === "orders" && (
            orders.length === 0
              ? <p>Aucune commande</p>
              : orders.map(o => (
                <div key={o._id} className="order-item">  
                <img   src={`http://localhost:5001${o.items[0].imageUrl}`}
               alt={o.items[0].nom }/>
                  <p > Commande n°
                    #{o._id} – {o.status} 
                  </p> 

                  <p> prix total de la commande <strong>{o.totalPrice}  €</strong></p>
               </div>
                ))
          )}

          {activeTab === "favorites" && (
            favorites.length === 0 ? (
              <p>Aucun favori</p>
            ) : (
              favorites.map(prod => (
                <div key={prod._id} className="favorite-item">
                  <Link to={`/product/${prod._id}`}>
                    <img    className="favorites__img"
                      src={`http://localhost:5001${prod.imageUrl}`}
                      alt={prod.nom}
                    />
                  </Link>

                  <p>{prod.nom}</p>

                  <div className="favorite-actions">
                    <Trash2 onClick={() => toggleFavorite(prod)} />
                    <Heart className="active" />
                  </div>
                </div>
              ))
            )
          )}
        </main>
      </div>
    </section>
  );
}



 
/*  Version 06/12/2025
export default function MonCompte() {
  const navigate = useNavigate();
  const { user, setUser, handleLogout } = useContext(UserContext);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("infos");
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Authentification");
      return;
    }

    // ✅ Recharger l’utilisateur depuis l’API /moncompte
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/users/moncompte", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.user) {
          navigate("/Authentification");
        } else {
          setUser(data.user); // contient _id, nom, prenom, email, role
        }
      } catch (err) {
        console.error("Erreur chargement utilisateur :", err);
        navigate("/Authentification");
      }
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

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user?._id) return;

    fetch(`http://localhost:5001/api/orders/user/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Erreur chargement commandes :", err));
  }, [user?._id]);

  const handleTabClick = (tabName) => setActiveTab(tabName);

  if (!user) {
    return (
      <section className="moncompte">
        <h2>Chargement du compte...</h2>
      </section>
    );
  }

  console.log("user", user);

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
*/



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
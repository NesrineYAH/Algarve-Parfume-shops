import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./MonCompte.scss";
import { UserContext } from "../../context/UserContext";
import { Heart } from "lucide-react";
import { Trash2 } from "lucide-react";


export default function MonCompte() {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("infos");
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);


  // 🟢 1. Vérification token + charger les adresses
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Authentification");
      return;
    }

    // Charger les adresses de l'utilisateur
    fetch("http://localhost:5001/api/addresses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAddresses(data))
      .catch((err) => console.error("Erreur chargement adresses :", err));

  }, [navigate]);

  // 🟢 2. Charger favoris depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // 🟢 3. Charger les commandes quand le user est disponible
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user || !user._id) return;

    fetch(`http://localhost:5001/api/orders/user/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || [])) //.then((data) => setOrders(data)) -L’erreur “orders.map is not a function” vient de cette ligne Parce que l’API ne retourne pas un tableau, mais un objet.  
      .catch((err) => console.error("Erreur chargement commandes :", err));
  }, [user]);

  // 🟢 Si le user n'est pas encore chargé
  if (!user) {
    return (
      <section className="moncompte">
        <h2>Chargement du compte...</h2>
      </section>
    );
  }
  
const moveToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Vérifier si le produit est déjà dans le panier
  const existing = cart.find((item) => item.variantId  === product.variantId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantite: 1 });
  }
  // Sauvegarder panier
  localStorage.setItem("cart", JSON.stringify(cart));

  // Retirer des favoris
  const updatedFav = favorites.filter((fav) => fav._id !== product._id);
  setFavorites(updatedFav);
  localStorage.setItem("favorites", JSON.stringify(updatedFav));
};

const removeFavorite = (variantId) => {
  const updated = favorites.filter(fav => fav.variantId !== variantId);
  setFavorites(updated);
  localStorage.setItem("favorites", JSON.stringify(updated));
};



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
          <button onClick={() => setActiveTab("infos")}>Mes Informations</button>
          <button onClick={() => setActiveTab("addresses")}>Mes Adresses</button>
          <button onClick={() => setActiveTab("orders")}>Mes Commandes</button>
          <button onClick={() => setActiveTab("favorites")}>Mes Favoris</button>
          <button onClick={() => setActiveTab("PaymentMethods")}>Mes Moyens de Paiement</button>

          <button onClick={handleLogout}>Déconnexion</button>
                   <Link to="/paiement-methods">Mes moyens de paiement</Link>
 
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
      <ul className="FavoriteSection">
        {favorites.map((prod) => (
          <li className="FavoriteSection__Li" key={prod.variantId}>
            <div className="FavoriteSection__I">
              <img
                src={`http://localhost:5001${prod.imageUrl}`}
                alt={prod.nom}
                className="FavoriteSection__img"
              />
                          
            </div>
  <button className="btn-Add" onClick={() => removeFavorite(prod._id)} > <Trash2 /> </button>
            <div className="FavoriteSection__II">
              {prod.nom} - {prod.prix} €
              <Heart
                className={`icone ${
                  favorites.some((fav) => fav._id === prod._id)
                    ? "active"
                    : "red"
                }`}
              />
              <p>Coffret - lisseur GHD chronos Contenance</p>

              <button className="btn-Add" onClick={() => moveToCart(prod)}>
                Déplacer au panier
              </button>

            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
)}


          {activeTab === "payments" && (
            <h2>Mes Moyens de Paiement</h2>
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
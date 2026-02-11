/* Frontend/src/pages/MonCompte/MonCompte.jsx */
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MonCompte.scss";
import { UserContext } from "../../context/UserContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import { Heart, Trash2 } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function MonCompte() {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("infos");
  const [orders, setOrders] = useState([]);
  const location = useLocation();

  /* 🔐 1) Vérification auth + chargement adresses */
  useEffect(() => {
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



 

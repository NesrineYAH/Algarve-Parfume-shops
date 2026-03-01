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

const updateAddress = async (id, updatedData) => {
  try {
    const res = await fetch(`http://localhost:5001/api/addresses/${id}`, {
      method: "PUT",
      credentials: "include", // envoie le cookie JWT
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erreur updateAddress :", data.message);
      return;
    }

    // Mise à jour locale de l'adresse
    setAddresses(prev =>
      prev.map(addr => (addr._id === id ? data.address : addr))
    );

    console.log("Adresse mise à jour avec succès");

  } catch (error) {
    console.error("Erreur updateAddress :", error);
  }
};

const deleteAddress = async (id) => {
  try {
    const res = await fetch(`http://localhost:5001/api/addresses/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erreur deleteAddress :", data.message);
      return;
    }

    // Retirer l'adresse du state pour mise à jour immédiate
    setAddresses(prev => prev.filter(addr => addr._id !== id));

    console.log("Adresse supprimée avec succès");

  } catch (error) {
    console.error("Erreur deleteAddress :", error);
  }
};

const toggleTab = (tab) => {
  setActiveTab(activeTab === tab ? null : tab);
};

  return (
    <section className="moncompte">
      <h1>Mon Compte</h1>
      <h2>Bienvenue, {user.prenom} {user.nom}</h2>

      <div className="moncompte__layout">
        <aside className="moncompte__sidebar">
          <button  onClick={() => toggleTab("infos")}>Infos</button>
          <button  onClick={() => toggleTab("addresses")} >Adresses</button>  {/* onClick={() => setActiveTab("addresses")}  */}
          <button onClick={() => toggleTab("orders")} > Commandes</button>    {/* onClick={() => setActiveTab("orders")}}  */}
          <button onClick={() => toggleTab("favorites")}  >Favoris</button>                   {/* onClick={() => setActiveTab("favorites")}  */}
           <button  onClick={() => toggleTab("paymentMethods")} >Moyens de paiement</button>       {/*  onClick={() => navigate("/paymentMethods")} */}
           <button onClick={handleLogout}>Déconnexion</button> {/* <button onClick={() => navigate("/handleLogout")}>Déconnexion</button> onClick={handleLogout} */}
        </aside>

        <main className="moncompte__content">
          {activeTab === "infos" && (
            <>
            <div className="moncompte__bloc">
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Rôle :</strong> {user.role}</p>
              </div>
            </>
          )}

          {activeTab === "addresses" && (
            
            <>
             <button onClick={() => navigate("/add-adresse")} className="btn-Add "> ➕ Ajouter une adresse</button>

              {addresses.map(addr => (
  <div key={addr._id} className="address-item">
    <p>{addr.street}, {addr.city}, {addr.postalCode}, {addr.country}</p>



     <button onClick={() => navigate("/add-adresse")} className="btn-Add "> ➕ Ajouter une adresse</button>
    <button onClick={() => updateAddress(addr._id, { street: "Nouvelle rue" })} className="btn-Add ">Modifier</button>
<button
  onClick={() => {
    if (window.confirm("Voulez-vous vraiment supprimer cette adresse ?")) {
      deleteAddress(addr._id);
    }
  }} className="btn-Add "
>
  Supprimer
</button>



  </div>
))}
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
                <div key={prod._id} className="favorite__item">
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


/*
onClick={() => setActiveTab("infos")}



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
             <button onClick={() => navigate("/add-adresse")} className="btn-Add "> ➕ Ajouter une adresse</button>

              {addresses.map(addr => (
  <div key={addr._id} className="address-item">
    <p>{addr.street}, {addr.city}, {addr.postalCode}, {addr.country}</p>



     <button onClick={() => navigate("/add-adresse")} className="btn-Add "> ➕ Ajouter une adresse</button>
    <button onClick={() => updateAddress(addr._id, { street: "Nouvelle rue" })} className="btn-Add ">Modifier</button>
<button
  onClick={() => {
    if (window.confirm("Voulez-vous vraiment supprimer cette adresse ?")) {
      deleteAddress(addr._id);
    }
  }} className="btn-Add "
>
  Supprimer
</button>



  </div>
))}
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

*/
 

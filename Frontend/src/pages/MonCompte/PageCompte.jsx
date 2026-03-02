/* Frontend/src/pages/MonCompte/MonCompte.jsx */
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PageCompte.scss";
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
  //02/03
  const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");


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


function AddressItem({ addr, navigate, updateAddress, deleteAddress }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="address-item">
      <p>
        {addr.street}, {addr.city}, {addr.postalCode}, {addr.country}
      </p>

      {/* Bouton 3 points */}
      <div className="menu-container">
        <button
          className="menu-btn"
          onClick={() => setOpenMenu(prev => !prev)}
        >
          ⋮
        </button>
        {openMenu && (
          <div className="menu-dropdown">
            <button onClick={() => navigate("/add-adresse")}>
              ➕ Ajouter une adresse
            </button>

            <button
              onClick={() => {
                updateAddress(addr._id, { street: "Nouvelle rue" });
                setOpenMenu(false);
              }}
            >
              ✏️ Modifier
            </button>

            <button
              onClick={() => {
                if (window.confirm("Voulez-vous vraiment supprimer cette adresse ?")) {
                  deleteAddress(addr._id);
                }
                setOpenMenu(false);
              }}
            >
              🗑️ Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 

const changePassword = async () => {
  if (newPassword !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas");
    return;
  }

  try {
    const res = await fetch("http://localhost:5001/api/users/change-password", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPassword,
        newPassword
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Erreur lors du changement de mot de passe"); return;
    }
    alert("Mot de passe mis à jour !");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error) {
    console.error("Erreur changePassword :", error);
    alert("Erreur serveur");
  }
};



  return (
    <section className="moncompte">
      <h1>Mon Compte</h1>
      <h2>Bienvenue, {user.prenom} </h2>

      {/* infos */}
      <div className="moncompte__layout">

     <div className="moncompte__part">
           <button  onClick={() => toggleTab("infos")}>Infos</button>
      </div>

      <div className="moncompte__bloc"> 
          {activeTab === "infos" && (
            <>
              <strong> {user.prenom} {user.nom}</strong>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Rôle :</strong> {user.role}</p>
            
            </>
          )}
     </div>
      </div>

      {/*Adresses */}
<div className="moncompte__layout">
   <div className="moncompte__part">
     <button  onClick={() => toggleTab("addresses")} >Adresses</button> 
   </div>

      <div className="moncompte__bloc">
        {activeTab === "addresses" && (
  <>
    {addresses.map(addr => (
      <AddressItem
        key={addr._id}
        addr={addr}
        navigate={navigate}
        updateAddress={updateAddress}
        deleteAddress={deleteAddress}
      />
    ))}
  </>
)}         
</div>
</div>


      {/* Commandes */}
      <div className="moncompte__layout">
     <div className="moncompte__part">
          <button onClick={() => toggleTab("orders")} > Commandes</button>
    </div>
    <div className="moncompte__bloc">  
        {activeTab === "orders" && (
      <div className="orders-table">  
      <div className="tableI"> 
        <span>N° Commande</span>
        <span>Date</span>
        <span>Status</span>
        <span> Montant</span>
     </div>  

      {orders.length === 0 ? (
          <span colSpan="5">Aucune commande</span>
      ) : (
        orders.map(o => (
   <div key={o._id} className="tableII" >
  <span><Link to={`/Orders/${o._id}`}>No : {o._id}</Link></span>
  <span>{new Date(o.createdAt).toLocaleDateString()}</span>
  <span>{o.status}</span>
  <span><strong>{o.totalPrice} €</strong></span>
   </div>
        ))
      )}
    </div>
  
)}


    </div>
      </div>
      {/* Favorites */}
        <div className="moncompte__layout"> 
   <div className="moncompte__part">
    <button onClick={() => toggleTab("favorites")}  >Favoris</button> 
   </div>
    <div className="moncompte__bloc">  
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
                    <Trash2 onClick={() => toggleFavorite(prod)}  className="icone"/>
                    <Heart className="active icone" />
                  </div>
                </div>
              ))
            )
          )}  
    </div>
    </div>
      {/** paymentMethods*/} 
         <div className="moncompte__layout">
     <div className="moncompte__part">
    <button  onClick={() => toggleTab("paymentMethods")} >Moyens de paiement</button> 
    </div>
        <div className="moncompte__bloc"> 
           </div>
    </div>


     {/** ChangPassword*/} 
         <div className="moncompte__layout">
     <div className="moncompte__part">
 <button onClick={() => toggleTab("security")}>Sécurité</button>   
  </div>
      <div className="moncompte__bloc security">
  {activeTab === "security" && (
    <div className="security">
      <h3>Changer mon mot de passe</h3>

      <input
        type="password"
        placeholder="Ancien mot de passe"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={changePassword}>Mettre à jour</button>
    </div>
  )}
</div>




    </div>
      {/** déconnection*/} 

    <div className="moncompte__layout"> 
<div className="moncompte__part">
        <button onClick={handleLogout}>Déconnexion</button> 
</div>

     <div className="moncompte__bloc"> 
     </div>
   </div>    

 
    </section>
  );

}

/*
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
*/
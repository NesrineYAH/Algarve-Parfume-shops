/* Frontend/src/pages/MonCompte/MonCompte.jsx */
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PageCompte.scss";
import { UserContext } from "../../context/UserContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import { Heart, Trash2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MonCompte() {
  const { t } = useTranslation(); // hook i18n
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("infos");
  const [orders, setOrders] = useState([]);
  const location = useLocation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [preferences, setPreferences] = useState({
    newsletter: false,
    sms: false,
    phoneContact: false,
  });

  /* 🔐 1) Vérification auth + chargement adresses */
  useEffect(() => {
    if (!user) {
      navigate("/Authentification");
      return;
    }

    fetch("http://localhost:5001/api/addresses", {
      method: "GET",
      credentials: "include",
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
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(console.error);
  }, [user]);

  /* 3) Charger préférences + phone */
  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
      setPreferences({
        newsletter: user.preferences?.newsletter || false,
        sms: user.preferences?.sms || false,
        phoneContact: user.preferences?.phoneContact || false,
      });
    }
  }, [user]);

  if (!user) {
    return <h2>{t("Chargement du compte...")}</h2>;
  }

  const updateAddress = async (id, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5001/api/addresses/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Erreur updateAddress :", data.message);
        return;
      }
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
                ➕ {t("preferences.addAdresse")}
              </button>

              <button
                onClick={() => {
                  updateAddress(addr._id, { street: t("NouvelleRue") });
                  setOpenMenu(false);
                }}
              >
                ✏️ {t("preferences.Modify")}
              </button>

              <button
                onClick={() => {
                  if (window.confirm(t("Voulez-vous vraiment supprimer cette adresse ?"))) {
                    deleteAddress(addr._id);
                  }
                  setOpenMenu(false);
                }}
              >
                🗑️ {t("preferences.supprimer")}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert(t("motsdepassenecorrespondentpas"));
      return;
    }
    try {
      const res = await fetch("http://localhost:5001/api/users/change-password", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || t("Erreur lors du changement de mot de passe"));
        return;
      }
      alert(t("Mot de passe mis à jour !"));
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Erreur changePassword :", error);
      alert(t("Erreur serveur"));
    }
  };

  const savePreferences = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users/preferences", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, preferences }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || t("Erreur"));
        return;
      }
      alert(t("Préférences enregistrées ✔️"));
    } catch (err) {
      console.error(err);
      alert(t("Erreur serveur"));
    }
  };

  return (
    <section className="moncompte">
      <h1>{t("preferences.Mon Compte")}</h1>
      <h2>{t("preferences.Bienvenue")}, {user.prenom}</h2>

      {/* Infos */}
      <div className="moncompte__layout">
        <div className="moncompte__part">
          <button onClick={() => toggleTab("infos")}>{t("preferences.Infos")}</button>
        </div>
        <div className="moncompte__bloc">
          {activeTab === "infos" && (
            <>
              <strong>{user.prenom} {user.nom}</strong>
              <strong>{t("preferences.Email")} :{user.email}</strong> 

            </>
          )}
        </div>
      </div>

      {/* Adresses */}
      <div className="moncompte__layout">
        <div className="moncompte__part">
          <button onClick={() => toggleTab("addresses")}>{t("preferences.Adresses")}</button>
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
          <button onClick={() => toggleTab("orders")}>{t("preferences.Commandes")}</button>
        </div>
        <div className="moncompte__bloc">
          {activeTab === "orders" && (
            <div className="orders-table">
              <div className="tableI">
                <span>{t("preferences.N°_Commande")}</span>
                <span>{t("preferences.Date")}</span>
                <span>{t("preferences.Status")}</span>
                <span>{t("preferences.Montant")}</span>
              </div>
              {orders.length === 0 ? (
                <span>{t("preferences.Aucune commande")}</span>
              ) : (
                orders.map(o => (
                  <div key={o._id} className="tableII">
                    <span><Link to={`/Orders/${o._id}`}>{t("No")} : {o._id}</Link></span>
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
          <button onClick={() => toggleTab("favorites")}>{t("preferences.Favoris")}</button>
        </div>
        <div className="moncompte__bloc">
          {activeTab === "favorites" && (
            favorites.length === 0 ? (
              <p>{t("preferences.Aucun favori")}</p>
            ) : (
              favorites.map(prod => (
                <div key={prod._id} className="favorite-item">
                  <Link to={`/product/${prod._id}`}>
                    <img
                      className="favorites__img"
                      src={`http://localhost:5001${prod.imageUrl}`}
                      alt={prod.nom}
                    />
                  </Link>
                  <p>{prod.nom}</p>
                  <div className="favorite-actions">
                    <Trash2 onClick={() => toggleFavorite(prod)} className="icone" />
                    <Heart className="active icone" />
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {/* Moyens de paiement */}
      <div className="moncompte__layout">
        <div className="moncompte__part">
          <button onClick={() => toggleTab("paymentMethods")}>{t("preferences.paymentMethode")}</button>
        </div>
        <div className="moncompte__bloc"></div>
      </div>

      {/* Sécurité */}
      <div className="moncompte__layout">
        <div className="moncompte__part">
          <button onClick={() => toggleTab("security")}>{t("preferences.Sécurité")}</button>
        </div>
        <div className="moncompte__bloc security">
          {activeTab === "security" && (
            <div className="security">
              <h3>{t("preferences.ChangePasseword")}</h3>
              <input
                type="password"
                placeholder={t("preferences.AncienMotdepasse")}
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder={t("preferences.Nouveaumotdepasse")}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder={t("preferences.ConfirmerMotdepasse")}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <button onClick={changePassword}>{t("preferences.Mettre à jour")}</button>
            </div>
          )}
        </div>
      </div>

      {/* Préférences */}
      <div className="moncompte__layout">
        <div className="moncompte__part">
          <button onClick={() => toggleTab("preferences")}>{t("preferences.Préférences")}</button>
        </div>
        <div className="moncompte__bloc">
          {activeTab === "preferences" && (
            <div className="security">
              <h3>{t("preferences.PréférencesCommunication")}</h3>

              <label>
                {t("preferences.NuméroTéléphone")}
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                />
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={preferences.newsletter}
                  onChange={() =>
                    setPreferences(p => ({ ...p, newsletter: !p.newsletter }))
                  }
                />
                {t("preferences.Recevoirnewsletter")}
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={preferences.sms}
                  onChange={() =>
                    setPreferences(p => ({ ...p, sms: !p.sms }))
                  }
                />
                {t("preferences.NotificationsSMS")}
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={preferences.phoneContact}
                  onChange={() =>
                    setPreferences(p => ({ ...p, phoneContact: !p.phoneContact }))
                  }
                />
                {t("preferences.Contact par téléphone")}
              </label>

              <button onClick={savePreferences}>{t("preferences.Enregistrer")}</button>
            </div>
          )}
        </div>
      </div>

      {/* Déconnexion */}
      <div className="moncompte__layout">
        <div className="moncompte__part">
          <button onClick={handleLogout}>{t("preferences.Déconnexion")}</button>
        </div>
        <div className="moncompte__bloc"></div>
      </div>
    </section>
  );
}





{/*
  
 import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PageCompte.scss";
import { UserContext } from "../../context/UserContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import { Heart, Trash2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MonCompte() {
    const { t } = useTranslation(); 
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("infos");
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [phone, setPhone] = useState("");
const [preferences, setPreferences] = useState({
  newsletter: false,
  sms: false,
  phoneContact: false,
});

  useEffect(() => {
    if (!user) {
      navigate("/Authentification");
      return;
    }

    fetch("http://localhost:5001/api/addresses", {
      method: "GET",
      credentials: "include",  
    })
      .then(res => res.json())
      .then(setAddresses)
      .catch(console.error);
  }, [user, navigate]);

  useEffect(() => {
    if (!user?._id) return;

    fetch(`http://localhost:5001/api/orders/user/${user._id}`, {
      method: "GET",
      credentials: "include",   
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
      credentials: "include", 
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

useEffect(() => {
  if (user) {
    setPhone(user.phone || "");
    setPreferences({
      newsletter: user.preferences?.newsletter || false,
      sms: user.preferences?.sms || false,
      phoneContact: user.preferences?.phoneContact || false,
    });
  }
}, [user]);

const savePreferences = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/users/preferences", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        preferences,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Erreur");
      return;
    }

    alert("Préférences enregistrées ✔️");
  } catch (err) {
    console.error(err);
    alert("Erreur serveur");
  }
};

  return (
    <section className="moncompte">
      <h1>Mon Compte</h1>
      <h2>Bienvenue, {user.prenom} </h2>

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
    <div className="moncompte__layout">
     <div className="moncompte__part">
    <button  onClick={() => toggleTab("paymentMethods")} >Moyens de paiement</button> 
    </div>
        <div className="moncompte__bloc"> 
           </div>
    </div>
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
  <div className="moncompte__layout">
  <div className="moncompte__part">
    <button onClick={() => toggleTab("preferences")}>
      Préférences
    </button>
  </div>

  <div className="moncompte__bloc">
    {activeTab === "preferences" && (
      <div className="security">
        <h3>Préférences de communication</h3>

        <label>
          Numéro de téléphone
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="06 12 34 56 78"
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={preferences.newsletter}
            onChange={() =>
              setPreferences(p => ({ ...p, newsletter: !p.newsletter }))
            }
          />
          Recevoir la newsletter
        </label>

        <label>
          <input
            type="checkbox"
            checked={preferences.sms}
            onChange={() =>
              setPreferences(p => ({ ...p, sms: !p.sms }))
            }
          />
          Notifications par SMS
        </label>

        <label>
          <input
            type="checkbox"
            checked={preferences.phoneContact}
            onChange={() =>
              setPreferences(p => ({ ...p, phoneContact: !p.phoneContact }))
            }
          />
          Contact par téléphone
        </label>

        <button onClick={savePreferences}>
          Enregistrer
        </button>
      </div>
    )}
  </div>
   </div>
  
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
  
  
  
  
  
  
  
  
  
  
  
  
  */}
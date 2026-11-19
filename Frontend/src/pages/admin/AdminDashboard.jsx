//Frontend/AdminDashBoard 

import React, { useState, useContext} from "react";
import { Link, Outlet } from "react-router-dom";
import "./admin.scss";
import { UserContext } from "../../context/UserContext";


export default function AdminDashboard() {
    const { user } = useContext(UserContext);

 if (!user) { return <p>Chargement...</p>; // ou redirection 
  }
   
  return (
    <section className="admin">
      <aside className="admin__sidebar">

        <h1> AdminOps Dashboard</h1>
             <h2>Bienvenue, {user.prenom} {user.nom} </h2>
             <h3>{user.email}</h3>
              <h4>Vous êtes le {user.role}</h4>

<Link to="addproduct">
  <button className="btn-Add">➕ Ajouter un produit</button>
</Link>
<Link to="products">
  <button className="btn-Add">📦 Gérer les produits</button>
</Link>
<Link to="promotions">
  <button className="btn-Add">🔥 Add Promotions</button>
</Link>
<Link to="orders">
  <button className="btn-Add">🚚 Gérer les commandes</button>
</Link>
<Link to="sales">
  <button className="btn-Add">🚚 Admin sales  </button>
</Link>
<Link to="users">
  <button className="btn-Add">🚚 Admin users  </button>
</Link>

      </aside>     
      <main className="admin__content">
        <Outlet />  {/* Ici les pages enfants vont s’afficher */}
      </main>
    </section>
  );
}

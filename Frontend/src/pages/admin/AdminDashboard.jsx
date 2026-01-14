import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./admin.scss";

export default function AdminDashboard() {
    const [product, setProduct] = useState(null);


//      const { id } = useParams();

  return (
    <section className="admin">
      <aside className="admin__sidebar">
        <h2>Dashboard</h2>
<Link to="add-product">
  <button className="btn-Add">➕ Ajouter un produit</button>
</Link>

<Link to="AdminProductMng">
  <button className="btn-Add">📦 Gérer les produits</button>
</Link>

<Link to="promotions">
  <button className="btn-Add">🔥 Add Promotions</button>
</Link>




      </aside>

     
      <main className="admin__content">
        <Outlet />  {/* Ici les pages enfants vont s’afficher */}
      </main>
    </section>
  );
}

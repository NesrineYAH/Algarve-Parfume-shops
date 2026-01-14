import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
//, useParams
import "./admin.scss";

export default function AdminDashboard() {
    const [product, setProduct] = useState(null);
//      const { id } = useParams();

  return (
    <section className="admin">
      <aside className="admin__sidebar">
        <h2>Dashboard</h2>

        <Link to="/admin/add-product">
           <button className="btn-Add"> ➕ Ajouter un produit</button>
         </Link>
         
        <Link to="/admin/AdminProductMng">
        <button className="btn-Add">   📦 Gérer les produits </button>
        </Link>

        <Link to="/admin/promotions">
      <button className="btn-Add"> 🔥Add Promotions  </button>
        </Link>
           {/* <Link to={`/admin/EditProduct/${product._id}`}
          className="btn-Add" >{t("product.edit")}</Link> */}
      </aside>

     
      <main className="admin__content">
        <Outlet />  {/* Ici les pages enfants vont s’afficher */}
      </main>
    </section>
  );
}

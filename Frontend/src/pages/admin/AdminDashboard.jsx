import { Link, Outlet } from "react-router-dom";
import "./admin.scss";

export default function AdminDashboard() {
  return (
    <section className="admin">
      <aside className="admin__sidebar">
        <h2>Dashboard</h2>

        <Link to="/admin/add-product">➕ Ajouter un produit</Link>
        <Link to="/admin/AdminProductManagement">
          📦 Gérer les produits
        </Link>
        <Link to="/admin/AdminPromotion">
          🔥 Promotions
        </Link>
      </aside>

      <main className="admin__content">
        <Outlet />
      </main>
    </section>
  );
}

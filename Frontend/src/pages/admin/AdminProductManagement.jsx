import React, { useState, useEffect } from "react";
import { getAllProducts, deleteProduct } from "../../Services/productService";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./admin.scss";

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/"); // redirige si pas admin
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Erreur récupération produits:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
      setMessage("Produit supprimé avec succès");
      fetchProducts(); // actualiser la liste
      navigate("/admin/AdminProductManagement");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la suppression");
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  return (
    <div className="admin-product-management">
      <h2>Gestion des produits</h2>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Catégorie</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id}>
              <td>{prod.nom}</td>
              <td>{prod.prix}</td>
              <td>{prod.stock}</td>
              <td>{prod.categorie_id}</td>
              <td>
                {prod.imageUrl && (
                  <img
                    src={`http://localhost:5001${prod.imageUrl}`}
                    alt={prod.nom}
                    width={50}
                  />
                )}
              </td>
              <td>
                <Link to="/admin/EditProduct" className="btn-Add">
                  <button onClick={() => handleEdit(prod._id)}>Modifier</button>
                </Link>
                <button onClick={() => handleDelete(prod._id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductManagement;

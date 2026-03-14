// pages/admin/AdminProductMng.jsx
// pages/admin/AdminProductMng.jsx
import React, { useState, useEffect } from "react";
import { getAllProducts, deleteProduct } from "../../Services/productService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.scss";

const AdminProductMng = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Récupérer tous les produits
        const productsData = await getAllProducts();
        setProducts(productsData);

        // 2️⃣ Récupérer toutes les catégories
        const categoriesRes = await axios.get("http://localhost:5001/api/categories");
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Erreur récupération produits ou catégories :", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      await deleteProduct(id);
      setMessage("Produit supprimé avec succès");
      // Mettre à jour la liste après suppression
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la suppression");
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin-dashboard/EditProduct/${productId}`);
  };

  return (
    <div className="admin-product-management">
      <h2>Gestion des produits</h2>
      {message && <p>{message}</p>}

      <table>
        <thead>
          <tr>
            <th>ID produit</th>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => {
            // Trouver le nom de la catégorie correspondant à l'ID
            const category = categories.find(cat => cat._id === prod.categorie_id);

            return (
              <tr key={prod._id}>
                <td>{prod._id}</td>
                <td>{prod.nom}</td>
                <td>{category?.nom || "Inconnu"}</td>
                <td>
                  {prod.imageUrl && (
                    <img
                      src={`http://localhost:5001${prod.imageUrl}`}
                      alt={prod.nom}
                      width={50}
                      style={{ borderRadius: "4px" }}
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(prod._id)}>Modifier</button>
                  <button onClick={() => handleDelete(prod._id)}>Supprimer</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductMng;



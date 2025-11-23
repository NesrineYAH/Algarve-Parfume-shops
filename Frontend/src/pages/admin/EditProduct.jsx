import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.scss";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/products/${id}`)
      .then((res) => {
        console.log("Produit récupéré :", res.data);
        //   setProduct(res.data.product || res.data);
        setProduct(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nom", product.nom);
    formData.append("prix", product.prix);
    formData.append("description", product.description);
    formData.append("stock", product.stock);
    formData.append("categorie_id", product.categorie_id);
    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.put(`http://localhost:5001/api/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="edit-product">
      <h2>Modifier un produit</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={product.nom || ""}
          onChange={(e) => setProduct({ ...product, nom: e.target.value })}
        />

        <input
          type="number"
          placeholder="Prix"
          value={product.prix || ""}
          onChange={(e) => setProduct({ ...product, prix: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={product.description || ""}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={product.stock || ""}
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
        />

        {/* <-- Affiche l’image actuelle du produit */}
        {product.imageUrl && (
          <img
            src={`http://localhost:5001${product.imageUrl}`}
            alt={product.nom}
            className="preview"
            style={{
              maxWidth: "150px",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          />
        )}

        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

        <button type="submit">Modifier</button>
      </form>
    </div>
  );
};

export default EditProduct;

/*
Cette ligne res.data.product || res.data fonctionne dans les deux cas : que le backend renvoie { product: {...} } ou directement le produit.
Ton formulaire est vide parce que product dans le state ne contient pas les données du backend.

Corrige le setProduct dans le useEffect selon la structure exacte de la réponse.

Les inputs vont alors se remplir automatiquement avec les valeurs existantes.
*/

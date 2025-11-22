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
      .then((res) => setProduct(res.data))
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
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
        <button type="submit">Modifier</button>
      </form>
    </div>
  );
};

export default EditProduct;

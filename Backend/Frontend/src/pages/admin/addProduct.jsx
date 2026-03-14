//Frontend/admin/addProduct.jsx 
import React, { useState, useEffect } from "react";
import { addProduct } from "../../Services/productService";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // si tu utilises axios
import "./admin.scss";

const AdminAddProduct = () => {
  const [nom, setNom] = useState("");
  const [genre, setGenre] = useState("");
 // const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null); // fichier image
  const [stock, setStock] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [size, setSize] = useState("");
  const [optionPrix, setOptionPrix] = useState("");
  const [optionStock, setOptionStock] = useState("");

useEffect(() => {
  const loadCategories = async () => {
    const response = await axios.get(
      "http://localhost:5001/api/categories",
      { withCredentials: true }
    );
    setCategories(response.data);
  };

  loadCategories();
}, []);



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("description", description);
    formData.append("categorie_id", categorieId);
    formData.append("genre", genre);


    if (imageFile) {
      formData.append("image", imageFile);
    }

    const data = await addProduct(formData);
    setMessage(data.message);

    // reset
    setNom("");
    setDescription("");
    setCategorieId("");
    setImageFile(null);
  } catch (error) {
    setMessage("Erreur lors de l'ajout du produit.");
  }
};


  return (
    <div className="admin-add-product">
      <h2>Ajouter un nouveau produit</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} required>
  <option value="">-- Choisir genre --</option>
  <option value="homme">Homme</option>
  <option value="femme">Femme</option>
  <option value="mixte">Mixte</option>
</select>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
    

        {/* Upload image depuis PC */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        {/* Liste déroulante catégorie */}
        <select
          value={categorieId}
          onChange={(e) => setCategorieId(e.target.value)}
          required
        >
          <option value="">-- Choisir une catégorie --</option>

          {categories.map((categorie) => (
            <option key={categorie._id} value={categorie._id}>
              {categorie.nom}
            </option>
          ))}
        </select>

        <button type="submit">Ajouter le produit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminAddProduct;



{/*
  <input type="number" placeholder="Taille (ex: 50)" value={size}
         onChange={(e) => setSize(e.target.value)} required />
        <input type="number"  placeholder="Prix" value={optionPrix}
          onChange={(e) => setOptionPrix(e.target.value)}  required />

               <input
       type="number"
         placeholder="Stock"
         value={optionStock}
         onChange={(e) => setOptionStock(e.target.value)}
          required
         />
  */}
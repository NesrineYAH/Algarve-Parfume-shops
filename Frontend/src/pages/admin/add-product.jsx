import React, { useState, useEffect } from "react";
import { addProduct } from "../../Services/productService";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // si tu utilises axios
import "./add-product.scss";


const AdminAddProduct = () => {
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null); // fichier image
  const [stock, setStock] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin" && role !== "vendeur") {
      navigate("/");
    }

    // Récupération des catégories
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/categories"); // ton endpoint
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error);
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(); // pour envoyer fichier + autres données
      formData.append("nom", nom);
      formData.append("prix", prix);
      formData.append("description", description);
      formData.append("stock", stock);
      formData.append("categorie_id", categorieId);

      if (imageFile) {
        formData.append("image", imageFile); // clé attendue côté backend
      }

      const data = await addProduct(formData); // assure-toi que addProduct supporte FormData
      setMessage(data.message);

      // reset
      setNom("");
      setPrix("");
      setDescription("");
      setStock("");
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
        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <input type="number" placeholder="Prix" value={prix} onChange={(e) => setPrix(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />

        {/* Upload image depuis PC */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        {/* Liste déroulante catégorie */}
  <select value={categorieId} onChange={(e) => setCategorieId(e.target.value)} required>
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


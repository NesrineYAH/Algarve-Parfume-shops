import React, { useState } from "react";
import axios from "axios";

const AdminAddProduct = () => {
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Assure-toi que le token est bien stocké

      const response = await axios.post(
        "http://localhost:3000/api/products/add",
        {
          nom,
          prix,
          description,
          imageUrl,
          stock,
          categorie_id: categorieId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Produit ajouté avec succès !");
      setNom("");
      setPrix("");
      setDescription("");
      setImageUrl("");
      setStock("");
      setCategorieId("");
    } catch (error) {
      setMessage("Erreur lors de l'ajout du produit.");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Ajouter un nouveau produit</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du produit"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Prix"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL de l'image"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <input
          type="text"
          placeholder="ID de la catégorie"
          value={categorieId}
          onChange={(e) => setCategorieId(e.target.value)}
        />
        <button type="submit">Ajouter le produit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminAddProduct;

import React, { useState } from "react";
import { addProduct } from  "../../Services/productService";
import './AdminAddProduct.scss';


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
      const productData = {
        nom,
        prix,
        description,
        imageUrl,
        stock,
        categorie_id: categorieId,
      };
      const data = await addProduct(productData);
      setMessage(data.message);
      // Réinitialiser les champs
      setNom("");
      setPrix("");
      setDescription("");
      setImageUrl("");
      setStock("");
      setCategorieId("");
    } catch (error) {
      setMessage("Erreur lors de l'ajout du produit.");
    }
  };

  return (
    <div className="admin-add-product ">
      <h2>Ajouter un nouveau produit</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <input type="number" placeholder="Prix" value={prix} onChange={(e) => setPrix(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
        <input type="text" placeholder="Catégorie ID" value={categorieId} onChange={(e) => setCategorieId(e.target.value)} />
        <button type="submit">Ajouter le produit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminAddProduct;

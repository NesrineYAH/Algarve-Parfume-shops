// src/services/productService.js
import axios from "axios";

const API_URL = "http://localhost:5001/api/Products";

// 🔹 Ajouter un produit
export const addProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/add`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    throw error;
  }
};

// 🔹 (Optionnel) Récupérer tous les produits
export const getAllProducts = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// 🔹 (Optionnel) Supprimer un produit
export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

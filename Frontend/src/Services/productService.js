// src/services/productService.js
import axios from "axios";

const API_URL = "http://localhost:5001/api/products";

export const addProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/add`, productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    throw error;
  }
};

export const getAllProducts = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getProductsByGenre = async (genre) => {
  try {
    const response = await axios.get(`${API_URL}`, { params: { genre } });
    return response.data;
  } catch (error) {
    console.error("Erreur lors du filtrage des produits :", error);
    throw error;
  }
};

export const updateProduct = async (id, updatedData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la modification du produit :", error);
    throw error;
  }
};

/*
le FormData avec Content-Type: "application/json", ce qui empêche Multer de recevoir le fichier.
Ne mets jamais Content-Type: application/json quand tu envoies un FormData.

Pour les appels PUT/POST avec fichiers (images), laisse Axios définir le Content-Type automatiquement.
*/

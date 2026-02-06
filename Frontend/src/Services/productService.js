// src/services/productService.js
import axios from "axios";

const API_URL = "http://localhost:5001/api/products";

// Ajouter un produit (JWT via cookie HTTP-only)
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, productData, {
      withCredentials: true, // ✅ indispensable pour envoyer le cookie
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    throw error;
  }
};

// Récupérer tous les produits
export const getAllProducts = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Récupérer un produit par ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error);
    throw error;
  }
};

// Supprimer un produit (JWT via cookie HTTP-only)
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error);
    throw error;
  }
};

// Filtrer les produits par genre
export const getProductsByGenre = async (genre) => {
  try {
    const response = await axios.get(`${API_URL}`, { params: { genre } });
    return response.data;
  } catch (error) {
    console.error("Erreur lors du filtrage des produits :", error);
    throw error;
  }
};

// Modifier un produit (JWT via cookie HTTP-only)
export const updateProduct = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData, {
      withCredentials: true,
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

// src/services/cart.js
import axios from "axios";

const API_URL = "http://localhost:5001/api/carts";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

export const getCart = () => {
  return axios.get(API_URL, authHeader());
};

export const addToCart = (item) => {
  return axios.post(`${API_URL}/add`, item, authHeader());
};

export const updateQuantity = (variantId, delta) => {
  if (!variantId) {
    console.error("❌ updateQuantity: variantId manquant");
    return Promise.reject("variantId manquant");
  }

  return axios.put(
    `${API_URL}/updateQuantity`,
    { variantId, delta },
    authHeader()
  );
};

export const removeItem = (variantId) => {
  if (!variantId) {
    console.error("❌ removeItem: variantId manquant");
    return Promise.reject("variantId manquant");
  }

  return axios.delete(
    `${API_URL}/removeItem/${variantId}`,
    authHeader()
  );
};

export const clearCart = () => {
  return axios.delete(`${API_URL}/clear`, authHeader());
};


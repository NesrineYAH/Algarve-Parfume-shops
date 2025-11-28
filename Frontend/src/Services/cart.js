// src/services/cart.js
import axios from "axios";

const API_URL = "http://localhost:5001/api/carts";

export const addToCart = async (productId) => {
  return axios.post(
    `${API_URL}/add`,
    { productId },
    { headers: { Authorization: localStorage.getItem("token") } }
  );
};

export const getCart = async () => {
  return axios.get(`${API_URL}/`, {
    headers: { Authorization: localStorage.getItem("token") },
  });
};

export const removeItem = async (productId) => {
  return axios.post(
    `${API_URL}/remove`,
    { productId },
    { headers: { Authorization: localStorage.getItem("token") } }
  );
};

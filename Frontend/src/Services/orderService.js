import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", // ← ton backend
});

// 🔐 Ajout automatique du token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const OrderService = {
  // ➤ Créer une commande
  createOrder: async (orderData) => {
    try {
      const response = await api.post("/orders/create", orderData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error);
      throw error;
    }
  },

  // ➤ Récupérer toutes les commandes
  getAllOrders: async () => {
    try {
      const response = await api.get("/orders/all");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);
      throw error;
    }
  },

  // ➤ Supprimer une commande
  deleteOrder: async (orderId) => {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de la commande :", error);
      throw error;
    }
  },

  // ➤ Modifier une commande (ex: adresse ou statut)
  updateOrder: async (orderId, updateData) => {
    try {
      const response = await api.put(`/orders/${orderId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification de la commande :", error);
      throw error;
    }
  },
};

export default OrderService;
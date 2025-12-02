import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
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
  createPreOrder: async (preOrderData) => {
    try {
      const response = await api.post("/orders/create", preOrderData);
      const preOrderId = response.data.preOrder._id; // ✅ correct

      localStorage.setItem("preOrderId", preOrderId);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la pré-commande :", error);
      throw error;
    }
  },

  updatePreOrder: async (preOrderId, updateData) => {
    if (!preOrderId) throw new Error("preOrderId invalide !");
    try {
      const response = await api.put(`/orders/${preOrderId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la pré-commande :", error);
      throw error;
    }
  },

  getPreOrderById: async (preOrderId) => {
    try {
      const response = await api.get(`/orders/${preOrderId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de la pré-commande :", error);
      throw error;
    }
  },

  finalizeOrder: async (preOrderId) => {
    try {
      const response = await api.post(`/orders/finalize/${preOrderId}`);
      localStorage.removeItem("preOrderId");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la finalisation de la commande :", error);
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

  // ➤ Modifier une commande finale
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

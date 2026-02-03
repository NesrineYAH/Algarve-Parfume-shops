// Services/orderService.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // ⭐ indispensable pour envoyer le cookie JWT
});


const OrderService = {
  createPreOrder: async (orderData) => {
    const response = await api.post("/orders/create", orderData);
    const preOrderId = response.data?.order?._id;
    if (preOrderId) {
      localStorage.setItem("preOrderId", preOrderId);
    }
    return response.data;
  },

  updateOrder: async (orderId, updateData) => {
    if (!orderId) throw new Error("orderId invalide");
    const response = await api.put(`/orders/${orderId}`, updateData);
    return response.data;
  },


  getOrderById: async (orderId) => {
    if (!orderId) throw new Error("orderId manquant");
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },


  finalizeOrder: async (orderId) => {
    if (!orderId) throw new Error("orderId manquant");
    const response = await api.post(`/orders/finalize/${orderId}`);
    localStorage.removeItem("preOrderId");
    return response.data;
  },
  // ➤ Marquer une commande comme PAYÉE
  markPaid: async (orderId) => {
    if (!orderId) throw new Error("orderId manquant");
    try {
      const response = await api.post(`/orders/${orderId}/mark-paid`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur markPaid :", error);
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    if (!orderId) throw new Error("orderId manquant");
    try {
      const response = await api.post(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur annulation commande :", error);
      throw error;
    }
  },

  // ➤ Récupérer toutes les commandes (admin)
  getAllOrders: async () => {
    const response = await api.get("/orders/all");
    return response.data;
  },

  // ➤ Récupérer les commandes de l’utilisateur connecté
  getMyOrders: async () => {
    const response = await api.get("/orders/my-orders");
    return response.data;
  },

  // ➤ Supprimer une commande
  deleteOrder: async (orderId) => {
    if (!orderId) throw new Error("orderId manquant");
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },

  getUserOrders: async (userId) => {
    if (!userId) throw new Error("userId manquant");
    const response = await api.get(`/orders/user/${userId}`);
    return response.data; // { preOrders, orders }
  },


  shipOrder: async (orderId) => {
    return axios.put(`/orders/ship/${orderId}`);
  },


};

export default OrderService;





















/*
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
      const response = await api.post("/orders/createOrder", preOrderData);
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
      const response = await api.post(`/orders/finalizeOrder/${preOrderId}`);
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
  async getUserOrders(userId) {
    const res = await axios.get(`http://localhost:5001/api/orders/user/${userId}`);
    return res.data;  // { orders, preOrders }
  }

};

export default OrderService;
*/
//Frontend /services/returnService.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api/returns",
    withCredentials: true,
});

const ReturnService = {
    // 🟢 Client : créer une demande de retour
    createReturn: async (data) => {
        const res = await api.post("/create", data);
        return res.data;
    },

    // 🟠 Admin : approuver un retour produit
    approveProductReturn: async (orderId, productId) => {
        const res = await api.put(`/${orderId}/approve`, { productId });
        return res.data;
    },

    // 🟣 Admin : rembourser un produit
    refundProduct: async (orderId, productId) => {
        const res = await api.put(`/${orderId}/refund`, { productId });
        return res.data;
    },
};

export default ReturnService;



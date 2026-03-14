// Frontend/src/services/returnService.js
import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

const ReturnService = {
    createReturn: async (data) => {
        try {
            const res = await api.post("/returns/create", data);
            return res.data;
        } catch (error) {
            console.error("❌ Erreur createReturn:", error.response?.data || error.message);
            throw error;
        }
    },

    getUserReturns: async () => {
        try {
            const res = await api.get("/returns/user");
            return res.data;
        } catch (error) {
            console.error("❌ Erreur getUserReturns:", error.response?.data || error.message);
            throw error;
        }
    },

    approveProductReturn: async (returnId) => {
        try {
            const res = await api.put(`/returns/${returnId}/approve`);
            return res.data;
        } catch (error) {
            console.error("❌ Erreur approveProductReturn:", error.response?.data || error.message);
            throw error;
        }
    },

    markAsReturned: async (orderId, productId) => {
        try {
            const res = await api.put(`/orders/${orderId}/${productId}/received`);
            return res.data;
        } catch (error) {
            console.error("❌ Erreur markAsReturned:", error.response?.data || error.message);
            throw error;
        }
    },

    refundProduct: async (orderId, productId) => {
        try {
            const res = await api.put(`/orders/${orderId}/${productId}/refund`);
            return res.data;
        } catch (error) {
            console.error("❌ Erreur refundProduct:", error.response?.data || error.message);
            throw error;
        }
    }
};

export default ReturnService;


















/*
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api/returns",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
});

const ReturnService = {
    createReturn: async (data) => {
        try {
            const res = await api.post("/create", data); 
            return res.data;
        } catch (error) {
            console.error("❌ Erreur createReturn:", error.response?.data || error.message);
            throw error;
        }
    },

    getUserReturns: async () => {
        try {
            // Note: Cette route n'existe pas encore dans votre router
            const res = await api.get("/user");
            return res.data;
        } catch (error) {
            console.error("❌ Erreur getUserReturns:", error.response?.data || error.message);
            throw error;
        }
    },

    approveProductReturn: async (returnId) => {
        return api.put(`/${returnId}/approve`);

    },

    refundProduct: async (orderId, productId) => {
        try {
            const res = await api.put(`/${orderId}/refund`, { productId });
            return res.data;
        } catch (error) {
            console.error("❌ Erreur refundProduct:", error.response?.data || error.message);
            throw error;
        }
    },

    markAsReturned(orderId, productId) {
        return api.put(
            `/orders/${orderId}/${productId}/received`
        );
    }
}

export default ReturnService;
*/












/*
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api/returns",
    withCredentials: true,
});

const ReturnService = {
    createReturn: async (data) => {
        const res = await api.post("/create", data);
        return res.data;
    },

    approveProductReturn: async (orderId, productId) => {
        const res = await api.put(`/${orderId}/approve`, { productId });
        return res.data;
    },

    refundProduct: async (orderId, productId) => {
        const res = await api.put(`/${orderId}/refund`, { productId });
        return res.data;
    },

    markAsReturned(orderId, productId) {
        return axios.put("/mark-returned", { orderId, productId },
            { withCredentials: true }
        );
    }
    

};

export default ReturnService;


*/
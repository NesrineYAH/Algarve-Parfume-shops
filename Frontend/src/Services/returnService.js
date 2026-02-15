// Frontend/src/services/returnService.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api/returns",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
});

const ReturnService = {
    // 🟢 CLIENT : Créer une demande de retour (1 ou plusieurs produits)
    createReturn: async (data) => {
        try {
            // Utilisation de la route /create comme défini dans votre router
            const res = await api.post("/create", data); // ← CHANGÉ : "/" → "/create"
            return res.data;
        } catch (error) {
            console.error("❌ Erreur createReturn:", error.response?.data || error.message);
            throw error;
        }
    },

    // 🟢 CLIENT : Récupérer tous les retours de l'utilisateur connecté
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

    // 🟠 ADMIN : Approuver un retour (attention: utilise orderId dans l'URL)
    /*
    approveProductReturn: async (returnId) => {
        const res = await api.put(`/${returnId}/approve`);
        return res.data;
    },
*/
    approveProductReturn: async (returnId) => {
        return api.put(`/${returnId}/approve`);

    },


    // 🟣 ADMIN : Rembourser un produit
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
        return axios.put("/mark-returned", { orderId, productId },
            { withCredentials: true }
        );

        // ⚠️ Les fonctions ci-dessous nécessitent d'être implémentées dans votre backend
        // getReturnById: async (returnId) => { ... },
        // cancelReturn: async (returnId) => { ... },
        // getAllReturns: async () => { ... },
        // rejectReturn: async (returnId, reason) => { ... },
        // approveProductReturn: async (returnId, productId, variantId) => { ... },
        // markProductAsReturned: async (returnId, productId, variantId) => { ... }
    }
}

export default ReturnService;













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
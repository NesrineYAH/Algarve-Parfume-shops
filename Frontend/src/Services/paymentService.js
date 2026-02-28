import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true,
});

const PaymentService = {
    // PayPal
    createPayPalOrder: async (total, orderId) => {
        const response = await api.post("/paypal/create-order", {
            total,
            orderId, // optionnel : lien avec la commande
        });
        return response.data; // { id }
    },

    capturePayPalOrder: async (paypalOrderId, orderId) => {
        const response = await api.post("/paypal/capture-order", {
            orderID: paypalOrderId,
            orderId, // pour finaliser côté backend
        });
        return response.data;
    },

    // (plus tard)
    // createStripeSession: ...
};

export default PaymentService;
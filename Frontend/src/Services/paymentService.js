//api/paymentService
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true,
});


const PaymentService = {

    createPayPalOrder: async (total, orderId) => {
        const response = await api.post("/paypal/create-order", {
            total,
            orderId, 
        });
        return response.data; 
    },

    capturePayPalOrder: async (paypalOrderId, orderId) => {
        const response = await api.post("/paypal/capture-order", {
            orderID: paypalOrderId,
            orderId, 
        });
        return response.data;
    },
};

export default PaymentService;
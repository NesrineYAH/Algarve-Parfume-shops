// DeliveryService.js
import axios from "axios";
const API_URL = "https://perfumealgarve.shop/api/delivery";

/**
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<Array>} 
 */
export async function getRelays(lat, lng) {
    try {
        const resp = await axios.get(`${API_URL}/relays`, {
            params: { lat, lng },
        });
        return resp.data.relays;
    } catch (error) {
        console.error("Erreur lors de la récupération des relais :", error);
        throw error;
    }
}


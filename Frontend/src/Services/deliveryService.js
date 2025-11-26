// DeliveryService.js

import axios from "axios";

const API_URL = "http://localhost:5001/api/delivery";

/**
 * Récupère les points relais proches d'une latitude/longitude
 * @param {number} lat - latitude
 * @param {number} lng - longitude
 * @returns {Promise<Array>} liste des relais
 */
export async function getRelays(lat, lng) {
    try {
        const resp = await axios.get(`${API_URL}/relays`, {
            params: { lat, lng },
        });
        return resp.data.relays; // le backend renvoie { relays: [...] }
    } catch (error) {
        console.error("Erreur lors de la récupération des relais :", error);
        throw error;
    }
}

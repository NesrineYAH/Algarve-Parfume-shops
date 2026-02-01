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
};

export default ReturnService;

import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5001/api",
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const getOrders = (token) => API.get(`/orders/customer`, { headers: { Authorization: `Bearer ${token}` } });
export const placeOrder = (data, token) => API.post("/orders", data, { headers: { Authorization: `Bearer ${token}` } });
export const updateOrderStatus = (orderId, status, token) => API.put(`/orders/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
export const getPendingOrders = (token) => API.get("/orders/pending", { headers: { Authorization: `Bearer ${token}` } });

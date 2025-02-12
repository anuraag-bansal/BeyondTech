import { io } from "socket.io-client";

// ✅ Connect to the backend WebSocket server
const socket = io("http://localhost:5001", {
    transports: ["websocket", "polling"],
    withCredentials: true, // Allows CORS with credentials
});

export default socket;

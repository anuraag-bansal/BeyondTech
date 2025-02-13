import { io } from "socket.io-client";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5001"; // ✅ Use environment variable

const socket = io(SERVER_URL, {
    path: "socket.io/",  // ✅ Important for Nginx proxying WebSockets
    transports: ["websocket", "polling"],
    withCredentials: true,
});

export default socket;

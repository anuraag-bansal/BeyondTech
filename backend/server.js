require("dotenv").config({path: "./.env"})
const path = require("path");
const express = require("express");
const http = require("http");
const mongoLib = require("./lib/mongo.lib");
const cors = require("cors");
const socketIo = require("socket.io");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const recommendationRoutes = require("./routes/recommendation.routes");
const { setupWebSockets } = require("./websocket");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "*",//["http://localhost:3000"],
        methods: ["GET", "POST", "PUT"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }
});

app.set("io", io);

;(async()=>{
    try {
        await mongoLib.connectToMongo(process.env.MONGO_URL);
        app.use(cors({ origin: "*", credentials: true }));


        app.use(express.json());

        app.use(express.static(path.join(__dirname, "views")));


        app.use((req, res, next) => {
            req.io = io;
            next();
        });
        setupWebSockets(io);

        app.use("/api/auth", authRoutes);
        app.use("/api/orders", orderRoutes);
        app.use("/api/recommendations",recommendationRoutes );

        const PORT = process.env.PORT || 5001;
        server.listen(PORT, "0.0.0.0", () => console.log(`🚀 WebSocket running on ${PORT}`));
    } catch (err) {
        console.log(err);
    }
})()


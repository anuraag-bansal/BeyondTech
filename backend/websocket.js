/** Used to set up the websockets server
 * @param io
 */
const setupWebSockets = (io) => {
    io.on("connection", (socket) => {
        console.log("📡 New client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("❌ Client disconnected:", socket.id);
        });
    });
};

module.exports = { setupWebSockets };

import { useEffect, useState, useContext, useCallback } from "react";
import { getOrders, updateOrderStatus } from "../api";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket"; // ✅ Import WebSocket connection

const DeliveryDashboard = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    // ✅ Fetch pending orders from API
    const fetchOrders = useCallback(async () => {
        try {
            const res = await getOrders(user.token);
            setOrders(res.data || []); // ✅ Ensure state is never undefined
        } catch (err) {
            console.error("❌ Error fetching orders:", err);
            setOrders([]); // ✅ Ensure orders is an empty array if there's an error
        }
    }, [user.token]);

    useEffect(() => {
        fetchOrders(); // ✅ Fetch orders on mount

        // ✅ Listen for real-time order updates
        const handleOrderUpdate = (updatedOrder) => {
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
            );
        };

        socket.on("orderUpdated", handleOrderUpdate);

        return () => {
            socket.off("orderUpdated", handleOrderUpdate); // ✅ Cleanup WebSocket listener
        };
    }, [fetchOrders]);

    // ✅ Handle order status update
    const handleUpdate = async (id, status) => {
        try {
           await updateOrderStatus(id, status, user.token);

            setOrders((prevOrders) =>
                prevOrders.map((o) => (o._id === id ? { ...o, status: status } : o))
            ); // ✅ Update order status in UI immediately
        } catch (error) {
            console.error("❌ Error updating order status:", error);
        }
    };

    return (
        <div>
            <h2>🚚 Delivery Partner Dashboard</h2>
            {orders.length > 0 ? (
                <ul>
                    {orders.map((order) => (
                        <li key={order._id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                            <strong>{order.product}</strong> - <span>{order.status}</span>
                            {order.status === "Pending" && (
                                <button onClick={() => handleUpdate(order._id, "Accepted")}>Accept</button>
                            )}
                            {order.status === "Accepted" && (
                                <button onClick={() => handleUpdate(order._id, "Out for Delivery")}>Out for Delivery</button>
                            )}
                            {order.status === "Out for Delivery" && (
                                <button onClick={() => handleUpdate(order._id, "Delivered")}>Mark as Delivered</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending orders available.</p>
            )}
        </div>
    );
};

export default DeliveryDashboard;

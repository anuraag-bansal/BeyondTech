import { useEffect, useState, useContext, useCallback } from "react";
import { getOrders, acceptOrder, updateOrderStatus,getUser } from "../api";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";

const DeliveryDashboard = () => {
    const { user } = useContext(AuthContext);
    const [userDetail, setUserDetail] = useState([]);
    const [orders, setOrders] = useState([]);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await getOrders(user.token);
            setOrders(res.data || []);
        } catch (err) {
            console.error("❌ Error fetching orders:", err);
            setOrders([]);
        }
    }, [user.token]);

    useEffect(() => {
        fetchOrders().then(r => console.log(r));
        userDetails().then(r => console.log(r));

        const handleOrderUpdate = (updatedOrder) => {
            console.log("📦 Order updated:", updatedOrder); // Debugging
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
            );
        };

        socket.on("orderUpdated", handleOrderUpdate);

        return () => {
            socket.off("orderUpdated", handleOrderUpdate);
        };
    }, [fetchOrders,setOrders]);

    const handleAcceptOrder = async (id) => {
        try {
            const res = await acceptOrder(id, user.token);
            const updatedOrder = res.data;
            console.log("✅ Order Accepted:", updatedOrder); // Debugging

            // ✅ Update local state instantly before refetching
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o._id === id ? updatedOrder : o))
            );

            // ✅ Emit WebSocket event to update other users instantly
            socket.emit("orderUpdated", updatedOrder);

            // ✅ Refetch orders to get latest data
            await fetchOrders();
        } catch (error) {
            console.error("❌ Error accepting order:", error);
        }
    };

// ✅ Fix order status update function
    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await updateOrderStatus(id, status, user.token);
            const updatedOrder = res.data;

            // ✅ Update state immediately
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o._id === id ? updatedOrder : o))
            );

            // ✅ Emit WebSocket event to sync UI
            socket.emit("orderUpdated", updatedOrder);

            // ✅ Fetch latest orders
            await fetchOrders();
        } catch (error) {
            console.error("❌ Error updating order status:", error);
        }
    };

    const userDetails = async () => {
        try {
            const res = await getUser(user.token);
            console.log(res.data);
            setUserDetail(res.data);
        } catch (err) {
            console.error("❌ Error fetching user:", err);
        }
    }

    return (
        <div>
            <h2>🚚 Delivery Partner Dashboard</h2>
            {orders.length > 0 ? (
                <ul>
                    {orders.map((order) => (
                        <li key={order._id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                            <strong>{order.product}</strong> - <span>{order.status}</span>
                            {order.status === "Pending" && (
                                <button onClick={() => handleAcceptOrder(order._id)}>Accept Order</button>
                            )}

                            {order.status === "Accepted" && order.deliveryPartnerId === userDetail._id && (
                                <button onClick={() => handleUpdateStatus(order._id, "Out for Delivery")}>Out for Delivery</button>
                            )}
                            {order.status === "Out for Delivery" && order.deliveryPartnerId === userDetail._id && (
                                <button onClick={() => handleUpdateStatus(order._id, "Delivered")}>Mark as Delivered</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No available orders.</p>
            )}
        </div>
    );
};

export default DeliveryDashboard;

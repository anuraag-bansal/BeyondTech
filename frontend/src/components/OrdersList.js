import { useEffect, useState, useContext } from "react";
import { getOrders } from "../api";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";

const OrdersList = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrders(user.token);
                setOrders(res.data);
            } catch (err) {
                setOrders([]);
            }
        };

        fetchOrders()

        socket.on("orderUpdated", (updatedOrder) => {
            console.log("🔄 Order Update Received via WebSocket:", updatedOrder); // ✅ Debugging

            setOrders((prevOrders) => {
                const orderExists = prevOrders.some((o) => o._id === updatedOrder._id);

                if (orderExists) {
                    // ✅ Update existing order
                    return prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o));
                } else {
                    // ✅ Add new order to the list
                    return [...prevOrders, updatedOrder];
                }
            });
        });

        return () => socket.off("orderUpdated");
    }, [user.token]);

    return (
        <div>
            <h2>Your Orders</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order._id}>
                        {order.product} - {order.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersList;

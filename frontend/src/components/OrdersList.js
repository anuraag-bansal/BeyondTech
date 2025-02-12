import { useEffect, useState, useContext } from "react";
import { getOrders } from "../api";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

const OrdersList = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect( () => {
        const fetchOrders = async () => {
            try {
                const res = await getOrders(user.token);
                setOrders(res.data);
            } catch (err) {
                setOrders([]);
            }
        };

        fetchOrders();

        socket.on("orderUpdated", (order) => {
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o._id === order._id ? order : o))
            );
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

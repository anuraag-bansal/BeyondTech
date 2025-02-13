import { useEffect, useState, useContext } from "react";
import { getOrders } from "../api";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import { Container, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";

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

        fetchOrders();

        socket.on("orderUpdated", (updatedOrder) => {
            console.log("🔄 Order Update Received via WebSocket:", updatedOrder);

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
        <Container component={Paper} elevation={3} style={{ padding: "20px", marginTop: "20px", maxWidth: "600px" }}>
            <Typography variant="h5" gutterBottom>
                📦 Your Orders
            </Typography>
            {orders.length > 0 ? (
                <List>
                    {orders.map((order) => (
                        <ListItem key={order._id} divider>
                            <ListItemText
                                primary={order.product}
                                secondary={`Status: ${order.status}`}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1" color="textSecondary">
                    No orders found.
                </Typography>
            )}
        </Container>
    );
};

export default OrdersList;

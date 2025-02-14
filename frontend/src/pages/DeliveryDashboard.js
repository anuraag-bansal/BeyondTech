import { useEffect, useState, useContext, useCallback } from "react";
import { getOrders, acceptOrder, updateOrderStatus,getUser } from "../api";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import { Container, Typography, Button, Card, CardContent, Grid2 } from "@mui/material";


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


    const userDetails = useCallback(async () => {
        try {
            const res = await getUser(user.token);
            setUserDetail(res.data);
        } catch (err) {
            console.error("❌ Error fetching user:", err);
        }
    }, [user.token]);

    useEffect(() => {
        fetchOrders()
        userDetails()

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
    }, [fetchOrders,userDetails]);

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


    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                🚚 Delivery Partner Dashboard
            </Typography>

            {orders.length > 0 ? (
                <Grid2 container spacing={3}>
                    {orders.map((order) => (
                        <Grid2 xs={12} sm={6} md={4} key={order._id}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6"><strong>{order.product}</strong></Typography>
                                    <Typography variant="subtitle1" color="textSecondary">Status: {order.status}</Typography>

                                    {order.status === "Pending" && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={() => handleAcceptOrder(order._id)}
                                            style={{ marginTop: "10px" }}
                                        >
                                            Accept Order
                                        </Button>
                                    )}

                                    {order.status === "Accepted" && order.deliveryPartnerId === userDetail._id && (
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            fullWidth
                                            onClick={() => handleUpdateStatus(order._id, "Out for Delivery")}
                                            style={{ marginTop: "10px" }}
                                        >
                                            Out for Delivery
                                        </Button>
                                    )}

                                    {order.status === "Out for Delivery" && order.deliveryPartnerId === userDetail._id && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            fullWidth
                                            onClick={() => handleUpdateStatus(order._id, "Delivered")}
                                            style={{ marginTop: "10px" }}
                                        >
                                            Mark as Delivered
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            ) : (
                <Typography>No available orders.</Typography>
            )}
        </Container>
    );
};

export default DeliveryDashboard;

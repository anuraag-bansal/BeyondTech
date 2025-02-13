import { useState, useContext } from "react";
import { placeOrder } from "../api";
import { AuthContext } from "../context/AuthContext";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";

const OrderForm = () => {
    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [location, setLocation] = useState("");
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await placeOrder({ product, quantity, location }, user.token);

            if (res.status === 404) {
                alert("Order not placed. No delivery partner found.");
                return;
            }

            alert("Order placed successfully!");
            setProduct("");
            setQuantity(1);
            setLocation("");
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert("Order not placed. No delivery partner found.");
            } else {
                alert("An error occurred while placing the order.");
            }
            console.error("❌ Order Placement Error:", error);
        }
    };

    return (
        <Container component={Paper} elevation={3} style={{ padding: "20px", marginTop: "20px", maxWidth: "500px" }}>
            <Typography variant="h5" gutterBottom>
                🛍️ Place an Order
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Product"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                />
                <TextField
                    label="Quantity"
                    variant="outlined"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <TextField
                    label="Delivery Location"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <Button variant="contained" color="primary" fullWidth type="submit" style={{ marginTop: "10px" }}>
                    Place Order
                </Button>
            </form>
        </Container>
    );
};

export default OrderForm;

import { useState, useContext } from "react";
import { placeOrder } from "../api";
import { AuthContext } from "../context/AuthContext";

const OrderForm = () => {
    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [location, setLocation] = useState("");
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await placeOrder({ product, quantity, location }, user.token);

            if (res.status === 404) {  // ✅ Check status correctly
                alert("Order not placed. No delivery partner found.");
                return;
            }

            alert("Order placed successfully!");
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert("Order not placed. No delivery partner found."); // ✅ Handles 404 errors
            } else {
                alert("An error occurred while placing the order.");
            }
            console.error("❌ Order Placement Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Product" value={product} onChange={(e) => setProduct(e.target.value)} />
            <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <input type="text" placeholder="Delivery Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <button type="submit">Place Order</button>
        </form>
    );
};

export default OrderForm;

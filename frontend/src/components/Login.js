import { useState, useContext } from "react";
import { loginUser } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);  // ✅ Ensure `AuthContext` is available
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await loginUser({ email, password });
            login(res.data); // ✅ Call `login` function from AuthContext
            const role = res.data.user.role
            navigate(role === "customer" ? "/customer-dashboard" : "/delivery-dashboard");
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <Container component={Paper} elevation={3} style={{ padding: "30px", maxWidth: "400px", marginTop: "50px" }}>
            <Typography variant="h5" gutterBottom>Login</Typography>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                Login
            </Button>
        </Container>
    );
};

export default Login;

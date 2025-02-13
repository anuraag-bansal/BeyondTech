import { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper, MenuItem } from "@mui/material";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer"); // Default role
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await registerUser({ name, email, password, role });
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            alert("Registration failed: " + (err.response?.data?.message || "Something went wrong"));
        }
    };

    return (
        <Container
            component={Paper}
            elevation={3}
            style={{ padding: "30px", maxWidth: "400px", marginTop: "50px", textAlign: "center" }}
        >
            <Typography variant="h5" gutterBottom>
                Register
            </Typography>
            <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
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
            <TextField
                select
                label="Role"
                variant="outlined"
                fullWidth
                margin="normal"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="delivery">Delivery Partner</MenuItem>
            </TextField>
            <Button variant="contained" color="primary" fullWidth onClick={handleRegister} style={{ marginTop: "20px" }}>
                Register
            </Button>
        </Container>
    );
};

export default Register;

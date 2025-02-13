import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <Container style={{ textAlign: "center", paddingTop: "50px" }}>
            <Typography variant="h4" gutterBottom>
                Welcome to Our E-Commerce Platform
            </Typography>
            <Typography variant="subtitle1">
                Shop easily & track your deliveries in real-time!
            </Typography>
            <Button
                variant="contained"
                color="primary"
                style={{ margin: "10px" }}
                onClick={() => navigate("/login")}
            >
                Login
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                style={{ margin: "10px" }}
                onClick={() => navigate("/register")}
            >
                Register
            </Button>
        </Container>
    );
};

export default Home;

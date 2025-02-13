import React from "react";
import OrderForm from "../components/OrderForm";
import OrdersList from "../components/OrdersList";
import Recommendations from "../components/Recommendations";
import { Container, Typography, Paper } from "@mui/material";

const CustomerDashboard = () => {
    return (
        <Container>
            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
                <Typography variant="h4" gutterBottom>
                    🛒 Customer Dashboard
                </Typography>
                <OrderForm />
                <OrdersList />
                <Recommendations />
            </Paper>
        </Container>
    );
};

export default CustomerDashboard;

import React, { useEffect, useState, useContext } from "react";
import {getRecommendations} from "../api";
import { AuthContext } from "../context/AuthContext";
import { Container, Typography, Paper } from "@mui/material";

const Recommendations = () => {
    const { user } = useContext(AuthContext);
    const [recommendations, setRecommendations] = useState("");

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await getRecommendations(user.token);
                setRecommendations(res.data.recommendations || "No recommendations available.");
            } catch (error) {
                console.error("❌ Error fetching recommendations:", error);
                setRecommendations("Failed to load recommendations.");
            }
        };

        fetchRecommendations();
    }, [user.token]);

    return (
        <Container component={Paper} elevation={3} style={{ padding: "20px", marginTop: "20px", maxWidth: "600px" }}>
            <Typography variant="h5" gutterBottom>
                🔥 AI-Based Product Recommendations
            </Typography>
            <Typography variant="body1" color="textSecondary">
                {recommendations} {/* ✅ Display raw text recommendation */}
            </Typography>
        </Container>
    );
};

export default Recommendations;

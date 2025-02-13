const express = require("express");
const { getRecommendations } = require("../controllers/recommendation.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// ✅ Get AI-based order recommendations for the logged-in user
router.get("/", authMiddleware, getRecommendations);

module.exports = router;

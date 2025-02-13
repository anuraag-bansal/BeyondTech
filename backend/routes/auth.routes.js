const express = require("express");
const { registerUser, loginUser,getUser } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user",authMiddleware, getUser);

module.exports = router;

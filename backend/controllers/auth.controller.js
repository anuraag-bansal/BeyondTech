const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const mongoLib = require("../lib/mongo.lib");

async function registerUser(req, res) {
    try {
        const {name, email, password, role} = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({message: "⚠️ All fields are required"});
        }

        const existingUser = await mongoLib.findOne(userModel, {email});
        if (existingUser) {
            return res.status(400).json({message: "⚠️ Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await mongoLib.findOneAndUpdate(userModel, {email}, {
            name,
            email,
            password: hashedPassword,
            role
        }, {upsert: true});

        return res.status(201).json({message: "✅ Registration successful"});
    } catch (err) {
        console.error("❌ Server Error:", err);
        return res.status(500).json({message: "❌ Internal Server Error"});
    }
}

async function loginUser(req, res) {
    const {email, password} = req.body;
    const user = await mongoLib.findOne(userModel, {email});

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({message: "Invalid credentials"});
    }

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "7d"});

    res.json({token: token, user: user});
}

module.exports = {registerUser, loginUser};

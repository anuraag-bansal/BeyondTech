const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const userModel = require("../models/user.model");
const mongoLib = require("../lib/mongo.lib");

/**
 * Registers a new user.
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.name - User's name.
 * @param {string} req.body.email - User's email.
 * @param {string} req.body.password - User's password.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response with success or error message.
 */
async function registerUser(req, res) {
    try {
        const {name, email, password, role} = req.body;

        if (_.isEmpty(name) || _.isEmpty(email) || _.isEmpty(password) || _.isEmpty(role)) {
            return res.status(400).json({message: "All fields are required"});
        }

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

/**
 * Logs in a user and returns a JWT token.
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.email - User's email.
 * @param {string} req.body.password - User's password.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response with token and user details.
 */
async function loginUser(req, res) {
    const {email, password} = req.body;
    const user = await mongoLib.findOne(userModel, {email});

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({message: "Invalid credentials"});
    }

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "7d"});

    res.json({token: token, user: user});
}

/**
 * Retrieves a user's information.
 * @param {Object} req - Express request object.
 * @param {Object} req.user - User object from JWT.
 * @param {Object} req.user.id - User's ID.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response with user details.
 */
async function getUser(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const user = await mongoLib.findOne(userModel, {_id: req.user.id});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        return res.json(user);
    } catch (err) {
        console.error("❌ Server Error:", err);
        return res.status(500).json({message: "❌ Internal Server Error"});
    }
}

module.exports = {registerUser, loginUser, getUser};

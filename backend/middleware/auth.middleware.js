const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const mongoLib = require("../lib/mongo.lib");

/** Middleware to authenticate user
 * @param req
 * @param res
 * @param next
 * @returns {Function} - The middleware function
 * */
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({message: "No token, authorization denied"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await mongoLib.findById(userModel, decoded.id);
        req.user.id = req.user._id;
        next();
    } catch (err) {
        res.status(401).json({message: "Token is not valid"});
    }
};

module.exports = {authMiddleware};

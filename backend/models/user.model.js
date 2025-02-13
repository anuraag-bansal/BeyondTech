const mongoose = require("mongoose");

/**
 * @typedef {Object} UserModel
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @property {string} role - The role of the user.
 */
const UserSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    role: {type: String, enum: ["customer", "delivery"], required: true}
});

module.exports = mongoose.connection
    .useDb("BeyondTech")
    .model('user', UserSchema)

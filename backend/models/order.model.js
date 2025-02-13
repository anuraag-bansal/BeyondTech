const mongoose = require("mongoose");

/**
 * @typedef {Object} OrderModel
 * @property {string} product - The name of the product.
 * @property {number} quantity - The quantity of the product.
 * @property {string} status - The status of the order.
 * @property {string} location - The location of the delivery.
 * @property {mongoose.Schema.Types.ObjectId} customerId - The customer ID.
 * @property {mongoose.Schema.Types.ObjectId} deliveryPartnerId - The delivery partner ID.
 */
const OrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    product: String,
    quantity: Number,
    status: { type: String, enum: ["Pending", "Accepted", "Out for Delivery", "Delivered"], default: "Pending" },
    location: String
});

module.exports = mongoose.connection
    .useDb("BeyondTech")
    .model('order', OrderSchema)

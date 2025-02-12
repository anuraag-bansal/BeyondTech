const mongoose = require("mongoose");

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

const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
const _ = require("lodash");
const mongoLib = require("../lib/mongo.lib");

async function placeOrder(req, res) {
    try {
        const {product, quantity, location} = req.body;

        const deliveryPartner = await mongoLib.findOne(userModel, {
            role: "delivery",
        });

        if (_.isEmpty(deliveryPartner)) return res.status(404).json({message: "No delivery partner found"});

        const order = await mongoLib.findOneAndUpdate(orderModel, {customerId: req.user.id,}, {
            product, quantity, location, deliveryPartnerId: deliveryPartner._id,
        }, {upsert: true, returnNewDocument: true});

        req.io.emit("orderUpdated", order);
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

async function updateOrderStatus(req, res) {
    try {
        const {status} = req.body;

        let order = await mongoLib.findById(orderModel, req.params.id);

        if (!order) return res.status(404).json({message: "Order not found"});

        order = await mongoLib.findOneAndUpdate(orderModel, {_id: req.params.id}, {status}, {returnNewDocument: true});

        const io = req.app.get("io"); // ✅ Get WebSocket instance from Express
        io.emit("orderUpdated", order); // ✅ Notify all clients

        res.json(order);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

async function getPendingOrders(req, res) {
    try {

        const orders = await mongoLib.findByQuery(orderModel, {
            customerId: req.user.id, status: "Pending"
        });

        if (_.isEmpty(orders)) return res.status(404).json({message: "No orders found"});

        res.json(orders);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

async function getOrders(req, res) {
    try {
        let orders = [];
        let query = {};

        if(req.user.role === "customer") {
            query = {customerId: req.user.id};
        }else {
            query = {deliveryPartnerId: req.user.id};
        }

        orders = await mongoLib.findByQuery(orderModel, query);

        res.json(orders);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

module.exports = {placeOrder, updateOrderStatus, getPendingOrders, getOrders};

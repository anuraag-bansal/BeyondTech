const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
const _ = require("lodash");
const mongoLib = require("../lib/mongo.lib");

async function placeOrder(req, res) {
    try {
        const {product, quantity, location} = req.body;

        const order = await mongoLib.insertOne(orderModel, {
            customerId: req.user.id,
            product, quantity, location,
        })

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

        if (req.user.role === "customer") {
            // ✅ Customers see only their own orders
            orders = await mongoLib.findByQuery(orderModel, { customerId: req.user.id });
        } else if (req.user.role === "delivery") {
            // ✅ Delivery partners see:
            // - Unassigned "Pending" orders
            // - Orders they have accepted
            orders = await mongoLib.findByQuery(orderModel, {
                $or: [
                    { status: "Pending", deliveryPartnerId: null },
                    { deliveryPartnerId: req.user.id }
                ]
            });
        }

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function acceptOrder(req, res) {
    try {
        let order = await mongoLib.findById(orderModel, req.params.id);

        if (!order) return res.status(404).json({message: "Order not found"});

        order = await mongoLib.findOneAndUpdate(orderModel, {_id: req.params.id}, {
            deliveryPartnerId: req.user.id,
            status: "Accepted"
        }, {new: true});

        const io = req.app.get("io"); // ✅ Get WebSocket instance from Express
        io.emit("orderUpdated", order); // ✅ Notify all clients

        console.log(order,"Order accepted by delivery partner", req.user.id);
        res.json(order);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

async function getPastOrders(req, res) {
    try {
        const orders = await mongoLib.findByQuery(orderModel, {customerId: req.user.id, status: {$ne: "Pending"}});
        if (_.isEmpty(orders)) return res.status(404).json({message: "No orders found"});

        res.json(orders);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

module.exports = {placeOrder, updateOrderStatus, getPendingOrders, getOrders, acceptOrder, getPastOrders};

const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
const _ = require("lodash");
const mongoLib = require("../lib/mongo.lib");

/** Place a new order
 * @param req
 * @param req.user - User object
 * @param req.body - Request body
 * @param req.body.product - Product name
 * @param req.body.quantity - Quantity
 * @param req.body.location - Delivery location
 * @param req.io - WebSocket instance
 * @param res
 * @returns {Promise<void>}
 */
async function placeOrder(req, res) {
    try {
        const {product, quantity, location} = req.body;

        if(_.isEmpty(product) || _.isEmpty(quantity) || _.isEmpty(location)) {
            return res.status(400).json({message: "All fields are required"});
        }

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

/** Update order status
 * @param req
 * @param req.params.id - Order ID
 * @param req.body - Request body
 * @param req.body.status - Order status
 * @param req.app - Express app
 * @param res
 * @returns {Promise<*>}
 */
async function updateOrderStatus(req, res) {
    try {
        const {status} = req.body;

        if(_.isEmpty(status)) {
            return res.status(400).json({message: "Status is required"});
        }

        let order = await mongoLib.findById(orderModel, req.params.id);

        if (!order) return res.status(404).json({message: "Order not found"});

        order = await mongoLib.findOneAndUpdate(orderModel, {_id: req.params.id}, {status}, {new: true});

        const io = req.app.get("io"); // ✅ Get WebSocket instance from Express
        io.emit("orderUpdated", order); // ✅ Notify all clients

        res.json(order);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

/** Get pending orders
 * @param req
 * @param req.user - User object
 * @param req.user.id - User ID
 * @param res
 * @returns {Promise<*>}
 */
async function getPendingOrders(req, res) {
    try {
        if(_.isEmpty(req.user.id)) {
            return res.status(400).json({message: "User ID is required"});
        }

        const orders = await mongoLib.findByQuery(orderModel, {
            customerId: req.user.id, status: "Pending"
        });

        if (_.isEmpty(orders)) return res.status(404).json({message: "No orders found"});

        res.json(orders);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

/**  Get orders
 * @param req
 * @param req.user - User object
 * @param req.user.role - User role
 * @param req.user.id - User ID
 * @param res
 * @returns {Promise<void>}
 */
async function getOrders(req, res) {
    try {

        if(_.isEmpty(req.user.role) || _.isEmpty(req.user.id)) {
            return res.status(400).json({message: "User role and ID are required"});
        }
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

/** Accept order
 * @param req
 * @param req.params.id - Order ID
 * @param req.user - User object
 * @param req.user.id - User ID
 * @param req.app - Express app
 * @param res
 * @returns {Promise<*>}
 */
async function acceptOrder(req, res) {
    try {
        if(_.isEmpty(req.user.id) || _.isEmpty(req.params.id)) {
            return res.status(400).json({message: "User ID and Order ID are required"});
        }
        let order = await mongoLib.findById(orderModel, req.params.id);

        if (!order) return res.status(404).json({message: "Order not found"});

        order = await mongoLib.findOneAndUpdate(orderModel, {_id: req.params.id}, {
            deliveryPartnerId: req.user.id,
            status: "Accepted"
        }, {new: true});

        const io = req.app.get("io"); // ✅ Get WebSocket instance from Express
        io.emit("orderUpdated", order); // ✅ Notify all clients

        res.json(order);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

/** Get past orders
 * @param req
 * @param req.user - User object
 * @param req.user.id - User ID
 * @param res
 * @returns {Promise<*>}
 */
async function getPastOrders(req, res) {
    try {
        if(_.isEmpty(req.user.id)) {
            return res.status(400).json({message: "User ID is required"});
        }
        const orders = await mongoLib.findByQuery(orderModel, {customerId: req.user.id, status: {$ne: "Pending"}});
        if (_.isEmpty(orders)) return res.status(404).json({message: "No orders found"});

        res.json(orders);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

module.exports = {placeOrder, updateOrderStatus, getPendingOrders, getOrders, acceptOrder, getPastOrders};

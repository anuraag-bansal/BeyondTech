require("dotenv").config({path: "../.env"});
const _ = require("lodash");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const orderModel = require("../models/order.model");
const mongoLib = require("../lib/mongo.lib");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

async function getRecommendations(req, res) {
    try {
        const customerId = req.user.id;

        // ✅ Fetch past orders for the customer
        const pastOrders = await mongoLib.findByQuery(orderModel, {customerId: customerId});

        if (_.isEmpty(pastOrders)) {
            return res.json({recommendations: [], message: "No order history found."});
        }

        // ✅ Extract order history as a string for AI
        const orderHistory = pastOrders.map((order) => `Product: ${order.product}, Quantity: ${order.quantity}`).join("\n");

        // ✅ Generate a prompt for AI to suggest products
        const prompt = `
            Based on the following past orders, recommend 5 similar or complementary products:
            ${orderHistory}

            Return a list of product names, separated by commas.
        `;

        const result = await model.generateContent(prompt);
        res.json({recommendations: result.response.text()});
    } catch (error) {
        console.error("❌ Error generating AI recommendations:", error);
        res.status(500).json({error: "Failed to fetch recommendations"});
    }
}

module.exports = {getRecommendations};

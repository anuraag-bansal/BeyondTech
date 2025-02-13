const express = require("express");
const { placeOrder, updateOrderStatus,getPendingOrders ,getOrders,getPastOrders,acceptOrder} = require("../controllers/order.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { roleAuthMiddleware } = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, roleAuthMiddleware(["customer"]), placeOrder);
router.put("/:id/status", authMiddleware, roleAuthMiddleware(["delivery"]), updateOrderStatus);
router.get("/pending", authMiddleware, roleAuthMiddleware(["delivery","customer"]), getPendingOrders);
router.get("/customer", authMiddleware, roleAuthMiddleware(["customer","delivery"]), getOrders);

router.get("/history", authMiddleware, roleAuthMiddleware(["customer"]), getPastOrders);

router.put("/accept/:id", authMiddleware, roleAuthMiddleware(["delivery"]), acceptOrder);


module.exports = router;

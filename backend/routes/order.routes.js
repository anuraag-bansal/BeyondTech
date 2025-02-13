const express = require("express");
const { placeOrder, updateOrderStatus,getPendingOrders ,getOrders,getPastOrders,acceptOrder} = require("../controllers/order.controller");
const { protect } = require("../middleware/auth.middleware");
const { roleAuth } = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", protect, roleAuth(["customer"]), placeOrder);
router.put("/:id/status", protect, roleAuth(["delivery"]), updateOrderStatus);
router.get("/pending", protect, roleAuth(["delivery","customer"]), getPendingOrders);
router.get("/customer", protect, roleAuth(["customer","delivery"]), getOrders);

router.get("/history", protect, roleAuth(["customer"]), getPastOrders);

router.put("/accept/:id", protect, roleAuth(["delivery"]), acceptOrder);


module.exports = router;

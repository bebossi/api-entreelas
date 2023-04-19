const { Router } = require("express");
const OrderController = require("../controllers/OrderController.js");

const router = Router();
router.get("/order", OrderController.getOrders);
router.post("/order/:userId", OrderController.createOrder);
router.delete("/order/:orderId", OrderController.deleteOrder);

module.exports = router;

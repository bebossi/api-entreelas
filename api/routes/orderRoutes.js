const { Router } = require("express");
const OrderController = require("../controllers/OrderController.js");
// const authYoutube = require("../middlewares/authYoutube.js");
// const attachCurrentUser = require("../middlewares/attachCurrentUser.js");
// const isAuth = require("../middlewares/isAuth.js");

const router = Router();
router.get("/order", OrderController.getOrders);
router.post("/order", OrderController.createOrderByCart);
router.delete("/order/:orderId", OrderController.deleteOrder);

module.exports = router;

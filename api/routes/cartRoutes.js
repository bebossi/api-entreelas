const { Router } = require("express");
const CartController = require("../controllers/CartController.js");
const router = Router();

router.post("/cart", CartController.postCart);
router.post("/cart/:cartId", CartController.addProduct);
router.post("/cartItem", CartController.createCartItem);
router.get("/cart/:cartId", CartController.getProductsCart);
router.delete("/cart/:cartId", CartController.removeProductCart);

module.exports = router;

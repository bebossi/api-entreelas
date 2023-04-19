const { Router } = require("express");
const ProductController = require("../controllers/ProductController.js");

const router = Router();

router.post("/products", ProductController.createProduct);
router.get("/products", ProductController.getProducts);
router.get("/products/:productId", ProductController.getProduct);
router.put("/products/:productId", ProductController.updateProduct);

module.exports = router;

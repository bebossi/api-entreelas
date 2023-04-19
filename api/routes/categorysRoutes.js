const { Router } = require("express");
const CategoryController = require("../controllers/CategoryController.js");

const router = Router();

router.get("/categorys", CategoryController.getCategorys);
router.get("/categorys/:categoryName", CategoryController.getCategory);
router.put("/categorys/:categoryId", CategoryController.updateCategory);
router.post("/categorys", CategoryController.createCategory);
router.delete("/categorys/:categoryId", CategoryController.deleteCategory);

module.exports = router;

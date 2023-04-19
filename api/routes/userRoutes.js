const { Router } = require("express");
const UserController = require("../controllers/UserController.js");

const router = Router();

router.get("/users", UserController.getUsers);
router.get("/users/:userId", UserController.getUser);
router.post("/users/signup", UserController.signUp);
router.post("/users/login", UserController.login);
router.put("/users/:userId", UserController.updateUser);
router.delete("/users/:userId", UserController.deleteUser);

module.exports = router;

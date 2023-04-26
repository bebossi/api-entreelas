const { Router } = require("express");
const UserController = require("../controllers/UserController.js");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser.js");

const router = Router();

router.get("/users", UserController.getUsers);
router.get("/users/:userId", UserController.getUser);
router.post("/users/signup", UserController.signUp);
router.post("/users/login", UserController.login);
router.put("/users", isAuth, attachCurrentUser, UserController.updateUser);
router.delete("/users/:userId", UserController.deleteUser);
router.post("/users/forgotPassword", UserController.forgotPassword);
router.put("/users/updatePassword/:token", UserController.updatePassword);

module.exports = router;

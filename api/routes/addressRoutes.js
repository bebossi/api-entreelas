const { Router } = require("express");
const AddressController = require("../controllers/AddressController.js");

const router = Router();

router.post("/address", AddressController.createAddres);
router.put("/address/:addressId", AddressController.updateAddres);

module.exports = router;

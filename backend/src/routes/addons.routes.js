const express = require("express");
const addonsController = require("../controllers/addons.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(addonsController.getAll));
router.get("/:id", asyncHandler(addonsController.getById));
router.post("/", asyncHandler(addonsController.create));
router.put("/:id", asyncHandler(addonsController.update));
router.delete("/:id", asyncHandler(addonsController.remove));

module.exports = router;
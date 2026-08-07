const express = require("express");
const ordersController = require("../controllers/orders.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(ordersController.getAll));
router.get("/:id", asyncHandler(ordersController.getById));
router.post("/", asyncHandler(ordersController.create));
router.patch("/:id/status", asyncHandler(ordersController.updateStatus));

module.exports = router;
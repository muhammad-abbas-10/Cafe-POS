const express = require("express");
const menuItemsController = require("../controllers/menuItems.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(menuItemsController.getAll));
router.get("/:id", asyncHandler(menuItemsController.getById));
router.post("/", asyncHandler(menuItemsController.create));
router.put("/:id", asyncHandler(menuItemsController.update));
router.delete("/:id", asyncHandler(menuItemsController.remove));

module.exports = router;
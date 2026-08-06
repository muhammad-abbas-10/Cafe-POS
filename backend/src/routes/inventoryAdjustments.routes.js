const express = require("express");
const inventoryAdjustmentsController = require("../controllers/inventoryAdjustments.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(inventoryAdjustmentsController.getAll));
router.get(
  "/ingredient/:ingredientId",
  asyncHandler(inventoryAdjustmentsController.getForIngredient)
);
router.get("/:id", asyncHandler(inventoryAdjustmentsController.getById));
router.post("/", asyncHandler(inventoryAdjustmentsController.create));

module.exports = router;
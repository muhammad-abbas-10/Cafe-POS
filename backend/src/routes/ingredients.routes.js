const express = require("express");
const ingredientsController = require("../controllers/ingredients.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(ingredientsController.getAll));
router.get("/:id", asyncHandler(ingredientsController.getById));
router.post("/", asyncHandler(ingredientsController.create));
router.put("/:id", asyncHandler(ingredientsController.update));
router.delete("/:id", asyncHandler(ingredientsController.remove));

module.exports = router;
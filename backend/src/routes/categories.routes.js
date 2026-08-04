const express = require("express");
const categoriesController = require("../controllers/categories.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(categoriesController.getAll));
router.get("/:id", asyncHandler(categoriesController.getById));
router.post("/", asyncHandler(categoriesController.create));
router.put("/:id", asyncHandler(categoriesController.update));
router.delete("/:id", asyncHandler(categoriesController.remove));

module.exports = router;
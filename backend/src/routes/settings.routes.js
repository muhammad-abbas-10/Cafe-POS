const express = require("express");
const settingsController = require("../controllers/settings.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(settingsController.getAll));
router.get("/:key", asyncHandler(settingsController.getByKey));
router.put("/:key", asyncHandler(settingsController.set));
router.delete("/:key", asyncHandler(settingsController.remove));

module.exports = router;
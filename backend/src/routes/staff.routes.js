const express = require("express");
const staffController = require("../controllers/staff.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(staffController.getAll));
router.get("/:id", asyncHandler(staffController.getById));
router.post("/", asyncHandler(staffController.create));
router.put("/:id", asyncHandler(staffController.update));
router.delete("/:id", asyncHandler(staffController.remove));

module.exports = router;
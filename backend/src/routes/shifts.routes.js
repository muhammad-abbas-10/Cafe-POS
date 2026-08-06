const express = require("express");
const shiftsController = require("../controllers/shifts.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(shiftsController.getAll));
router.get("/:id", asyncHandler(shiftsController.getById));
router.post("/", asyncHandler(shiftsController.clockIn));
router.patch("/:id/clock-out", asyncHandler(shiftsController.clockOut));
router.delete("/:id", asyncHandler(shiftsController.remove));

module.exports = router;
const express = require("express");
const authController = require("../controllers/auth.controller");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.post("/login", asyncHandler(authController.login));

module.exports = router;
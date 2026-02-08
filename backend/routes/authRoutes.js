const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authmiddleware");

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// Update Profile Route
router.put("/update", authMiddleware, authController.updateProfile);

module.exports = router;

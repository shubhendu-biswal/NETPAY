const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Register route
router.post("/register", async (req, res) => {
  console.log("Register route called");
  console.log("Request body:", req.body);
  try {
    const { phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  console.log("Login route called");
  console.log("Request body:", req.body);

  try {
    const { phone, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(200).json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ success: false, message: "Incorrect password" });
    }
    
    
    // Login success
    res.status(200).json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

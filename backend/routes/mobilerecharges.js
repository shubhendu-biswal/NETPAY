const express = require("express");
const router = express.Router();
const MobileRecharge = require("../models/mobilerecharge");

// Create recharge (initially unpaid)
router.post("/recharge", async (req, res) => {
  try {
    const { mobileNumber, operator, circle, amount } = req.body;
    const recharge = await MobileRecharge.create({
      mobileNumber,
      operator,
      circle,
      amount,
      status: "" // initial
    });
    res.json({ success: true, recharge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mark recharge as success after payment
router.post("/recharge/:id/success", async (req, res) => {
  try {
    const recharge = await MobileRecharge.findByIdAndUpdate(
      req.params.id,
      { status: "success" },
      { new: true }
    );
    if (!recharge) return res.status(404).json({ success: false, message: "Recharge not found" });
    res.json({ success: true, recharge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fetch all recharges (history)
router.get("/history", async (req, res) => {
  try {
    const recharges = await MobileRecharge.find().sort({ date: -1 });
    res.json({ success: true, recharges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

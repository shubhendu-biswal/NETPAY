const express = require("express");
const router = express.Router();
const DthRecharge = require("../models/dthrecharge");

// Create recharge with no status initially (or null)
router.post("/recharges", async (req, res) => {
  try {
    const { operator, customerId, amount } = req.body;

    if (!operator || !customerId || !amount)
      return res.status(400).json({ success: false, message: "All fields are required" });

    // Create recharge without status (it will not appear in history yet)
    const recharge = new DthRecharge({
      operator,
      customerId,
      amount
    });

    await recharge.save();

    res.json({ success: true, message: "Recharge initiated", recharge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark recharge as success after payment
router.post("/recharges/:id/success", async (req, res) => {
  try {
    const recharge = await DthRecharge.findById(req.params.id);
    if (!recharge) return res.status(404).json({ success: false, message: "Recharge not found" });

    recharge.status = "success"; // mark as success
    await recharge.save();

    res.json({ success: true, message: "Recharge successful", recharge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch only successful recharge history (latest first)
router.get("/history", async (req, res) => {
  try {
    const recharges = await DthRecharge.find({ status: "success" }).sort({ _id: -1 });
    res.json({ success: true, recharges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

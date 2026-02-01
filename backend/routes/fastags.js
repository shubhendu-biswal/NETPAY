const express = require("express");
const router = express.Router();
const FastagRecharge = require("../models/fastag");

// -------------------
// Create a new recharge
// -------------------
router.post("/recharges", async (req, res) => {
  try {
    const { vehicleNumber, provider, customerId, amount } = req.body;

    if (!vehicleNumber || !provider || !customerId || !amount) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const recharge = new FastagRecharge({
      vehicleNumber,
      provider,
      customerId,
      amount,
      status: "Success",
    });

    await recharge.save();

    res.json({ success: true, message: "Recharge successful ✅", recharge });
  } catch (err) {
    console.error("Error during recharge:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------
// Get recharge history (latest 10, newest first)
// -------------------
router.get("/histories", async (req, res) => {
  try {
    const histories = await FastagRecharge.find()
      .sort({ date: -1 }) // newest first
      .limit(10);         // last 10 records only

    res.json({ success: true, histories });
  } catch (err) {
    console.error("Error fetching histories:", err);
    res.status(500).json({ success: false, message: "Error fetching histories" });
  }
});

module.exports = router;

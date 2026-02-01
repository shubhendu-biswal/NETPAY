const express = require("express");
const router = express.Router();
const checkbalance = require("../models/checkbalance");

// check balance api
router.post("/check-balance", async (req, res) => {
  try {
    const { bankname, pin } = req.body;

    if (!bankname || !pin) {
      return res.status(400).json({ success: false, message: "bank name and pin are required" });
    }

    const account = await checkbalance.findOne({ bankname });

    if (!account) {
      return res.status(404).json({ success: false, message: "bank account not found" });
    }

    if (account.pin !== pin) {
      return res.status(401).json({ success: false, message: "invalid pin" });
    }

    res.json({
      success: true,
      bankname: account.bankname,
      accountnumber: account.accountnumber,
      balance: account.balance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "server error" });
  }
});

module.exports = router;

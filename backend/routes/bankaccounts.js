const express = require("express");
const router = express.Router();
const BankAccount = require("../models/bankaccount");

// POST /transfer
router.post("/transfer", async (req, res) => {
  try {
    const { account, ifsc, amount, type } = req.body;

    // Validate all fields
    if (!account || !ifsc || !amount || !type) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.json({ success: false, message: "Invalid amount" });
    }

    // Find account in DB
    const acc = await BankAccount.findOne({ accountNumber: account, ifscCode: ifsc });
    if (!acc) return res.json({ success: false, message: "Account number/IFSC not valid" });

    // Check balance
    if (acc.balance < amountNum) return res.json({ success: false, message: "Insufficient balance" });

    // Deduct balance and add transaction
    acc.balance -= amountNum;

    // Ensure transactions array exists
    if (!Array.isArray(acc.transactions)) acc.transactions = [];

    acc.transactions.unshift({
      ifsc,
      amount: amountNum,
      type,
      status: "Success",
      time: new Date()
    });

    // Keep only latest 5 transactions
    if (acc.transactions.length > 5) acc.transactions = acc.transactions.slice(0, 5);

    await acc.save();

    res.json({ success: true, message: "Transaction successful", transactions: acc.transactions });
  } catch (err) {
    console.error("❌ Transfer error:", err); // log full error
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
});

// GET /history/:accountNumber
router.get("/history/:accountNumber", async (req, res) => {
  try {
    const acc = await BankAccount.findOne({ accountNumber: req.params.accountNumber });

    if (!acc) return res.json({ success: false, message: "Account not found" });

    const sortedTransactions = (acc.transactions || []).sort((a, b) => b.time - a.time);

    res.json({ success: true, history: sortedTransactions });
  } catch (err) {
    console.error("❌ History error:", err); // log full error
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
});

module.exports = router;

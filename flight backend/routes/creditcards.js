const express = require("express");
const router = express.Router();
const creditcard = require("../models/creditcard");

// ✅ 1. Fetch bill by card number + provider (ignore spaces & status case)
router.post("/fetch", async (req, res) => {
  try {
    const { cardnumber, cardProvider } = req.body;
    if (!cardnumber || !cardProvider) {
      return res.json({ success: false, message: "Card number or provider missing" });
    }
    const inputNumber = cardnumber.replace(/\s+/g, ""); // remove spaces from input

    // Get all unpaid cards with same provider
    const bills = await creditcard.find({
      cardProvider: cardProvider,
      status: { $regex: /^unpaid$/i }
    });

    // Filter in JS to ignore spaces
    const bill = bills.find(b => b.cardnumber.replace(/\s+/g, "") === inputNumber);

    if (!bill) {
      return res.json({ success: false, message: "No unpaid bill found. Enter manually." });
    }

    res.json({ success: true, bill });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ 2. Pay bill (save to history)
router.post("/pay/:billId", async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const bill = await creditcard.findById(req.params.billId);
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    if (/paid/i.test(bill.status)) return res.json({ success: false, message: "Bill already paid" });

    const txnId = "TXN" + Date.now();

    // Save payment history
    bill.payments.push({
      amount: bill.dueAmount,
      transactionId: txnId,
      status: "Success",
      date: new Date()
    });

    // Mark bill as paid
    bill.status = "Paid";
    await bill.save();

    // Return payment receipt
    res.json({
      success: true,
      payment: {
        _id: txnId,
        cardnumber: bill.cardnumber,
        holdername: bill.holdername,
        cardProvider: bill.cardProvider,
        amount: bill.dueAmount,
        method: paymentMethod,
        date: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ 3. Get payment history for a card (ignore spaces)
router.get("/history/:cardnumber", async (req, res) => {
  try {
    const inputNumber = req.params.cardnumber.replace(/\s+/g, "");

    const bills = await creditcard.find({
      $expr: { $eq: [{ $replaceAll: ["$cardnumber", " ", ""] }, inputNumber] }
    });

    if (!bills || bills.length === 0) {
      return res.json({ success: false, message: "No payment history found" });
    }

    // Collect all payments
    const history = [];
    bills.forEach(bill => {
      bill.payments.forEach(p => {
        history.push({
          cardnumber: bill.cardnumber,
          holdername: bill.holdername,
          provider: bill.cardProvider,
          amount: p.amount,
          transactionId: p.transactionId,
          status: p.status,
          date: p.date
        });
      });
    });

    res.json(history); // return array directly
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

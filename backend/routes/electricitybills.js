const express = require("express");
const router = express.Router();
const ElectricityBill = require("../models/electricitybill");

// ---------------------
// Fetch existing unpaid bill
// ---------------------
router.post("/fetch", async (req, res) => {
  try {
    let { board, consumerNumber } = req.body;

    if (!board || !consumerNumber) {
      return res.json({ success: false, message: "Board and consumer number are required." });
    }

    board = board.trim();
    consumerNumber = consumerNumber.trim();

    // Flexible match: case-insensitive board, exact consumerNumber, only unpaid
    const bill = await ElectricityBill.findOne({
      board: { $regex: board, $options: "i" },
      consumerNumber,
      status: "Unpaid"
    }).lean();

    if (!bill) return res.json({ success: false, message: "No unpaid bill found." });

    // Only return required fields
    const responseBill = {
      _id: bill._id,
      board: bill.board || "",
      consumerNumber: bill.consumerNumber || "",
      areaCode: bill.areaCode || "",
      billAmount: bill.billAmount || 0,
      status: bill.status || "Unpaid",
      dueDate: bill.dueDate || null,
      lateFee: bill.lateFee || 0
    };

    res.json({ success: true, bill: responseBill });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------
// Create manual bill
// ---------------------
router.post("/manual", async (req, res) => {
  try {
    const { board, consumerNumber, areaCode, billAmount, dueDate, lateFee } = req.body;

    const newBill = new ElectricityBill({
      board,
      consumerNumber,
      areaCode,
      billAmount,
      dueDate,
      lateFee,
      status: "Unpaid"
    });

    await newBill.save();
    res.json({ success: true, bill: newBill });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------
// Pay bill
// ---------------------
router.post("/pay/:billId", async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const bill = await ElectricityBill.findById(req.params.billId);

    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    if (bill.status === "Paid") return res.json({ success: false, message: "Bill already paid" });

    const txnId = "ELEC" + Date.now();

    bill.payments.push({
      amount: bill.billAmount,
      transactionId: txnId,
      status: "Success",
      date: new Date()
    });

    bill.status = "Paid";
    bill.transactionId = txnId;
    bill.paidAt = new Date();

    await bill.save();

    res.json({
      success: true,
      receipt: {
        transactionId: txnId,
        board: bill.board,
        consumerNumber: bill.consumerNumber,
        areaCode: bill.areaCode || "",
        amount: bill.billAmount,
        method: paymentMethod,
        date: new Date()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------
// Get payment history
// ---------------------
router.get("/history/:consumerNumber", async (req, res) => {
  try {
    const consumerNumber = req.params.consumerNumber.trim();

    const bills = await ElectricityBill.find({ consumerNumber }).lean();

    if (!bills || bills.length === 0)
      return res.json({ success: false, message: "No payment history found." });

    const history = [];
    bills.forEach(bill => {
      (bill.payments || []).forEach(p => {
        history.push({
          board: bill.board,
          consumerNumber: bill.consumerNumber,
          amount: p.amount,
          transactionId: p.transactionId,
          status: p.status,
          date: p.date
        });
      });
    });

    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

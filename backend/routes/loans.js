const express = require("express");
const router = express.Router();
const Loan = require("../models/loan");

// 1️⃣ Fetch loan details by provider & account number
router.post("/fetch", async (req, res) => {
  try {
    const { loanProvider, accountNumber } = req.body;
    if (!loanProvider || !accountNumber) {
      return res.json({ success: false, message: "Loan provider or account number missing" });
    }

    const loan = await Loan.findOne({ loanProvider, accountNumber });
    if (!loan) {
      return res.json({ success: false, message: "No loan found. Enter manually." });
    }

    res.json({ success: true, loan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2️⃣ Pay EMI
router.post("/pay/:loanId", async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) return res.json({ success: false, message: "Loan not found" });

    const today = new Date().toDateString();
    const alreadyPaidToday = loan.payments?.some(p => new Date(p.date).toDateString() === today);

    if (alreadyPaidToday) {
      return res.json({ success: false, message: "EMI already paid today" });
    }

    const txnId = "EMI" + Date.now();

    if (!loan.payments) loan.payments = [];
    const paymentRecord = {
      amount: loan.emiAmount,
      transactionId: txnId,
      status: "Success",
      date: new Date()
    };
    loan.payments.push(paymentRecord);

    loan.nextDueDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    await loan.save();

    res.json({
      success: true,
      payment: paymentRecord,
      payments: loan.payments,
      loanId: loan._id
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3️⃣ Get EMI payment history by account number
router.get("/history/:accountNumber", async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber.trim();
    const loans = await Loan.find({ accountNumber });

    const history = [];
    loans.forEach(loan => {
      if (loan.payments && loan.payments.length > 0) {
        loan.payments.forEach(p => {
          history.push({
            loanProvider: loan.loanProvider,
            accountNumber: loan.accountNumber,
            customerName: loan.customerName,
            amount: p.amount,
            transactionId: p.transactionId,
            status: p.status,
            date: p.date
          });
        });
      }
    });

    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const payment = require('../models/payment');

// post /api/pay
router.post('/', async (req, res) => {
  const { type, reference, amount } = req.body;

  try {
    const newpayment = new payment({
      type,
      reference,
      amount,
      status: 'success'
    });

    await newpayment.save();

    res.status(200).json({ message: 'payment recorded successfully', payment: newpayment });
  } catch (err) {
    res.status(500).json({ message: 'failed to record payment', error: err.message });
  }
});

// get /api/pay/history
router.get('/history', async (req, res) => {
  try {
    const payments = await payment.find().sort({ date: -1 });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: 'failed to fetch payment history', error: err.message });
  }
});

module.exports = router;

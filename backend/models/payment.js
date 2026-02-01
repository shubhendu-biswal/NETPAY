const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  type: { type: String, required: true },      // creditcard, mobile, electricity, water
  reference: { type: String, required: true }, // card number, mobile number, account number
  amount: { type: Number, required: true },
  status: { type: String, default: 'success' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('payment', paymentSchema);

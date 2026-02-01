const mongoose = require("mongoose");

const gasbillSchema = new mongoose.Schema({
  provider: String, // instead of board
  consumerNumber: String,
  areaCode: String,
  consumerName: String,
  billAmount: Number,
  dueDate: String,
  lateFee: Number,
  status: { type: String, default: "Unpaid" },
  transactionId: String,
  paidAt: Date,
  payments: [
    {
      amount: { type: Number, required: true },
      transactionId: { type: String, required: true },
      status: { type: String, default: "Success" },
      date: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("gasbill", gasbillSchema);

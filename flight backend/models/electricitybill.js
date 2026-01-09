const mongoose = require("mongoose");

const electricitybillSchema = new mongoose.Schema({
  board: String,
  consumerNumber: String,
  areaCode: String,
  billAmount: Number,
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

module.exports = mongoose.model("electricitybill", electricitybillSchema);

const mongoose = require("mongoose");

const waterbillSchema = new mongoose.Schema({
  board: String,                      // Water supply board/company
  consumerNumber: String,             // Unique consumer ID
  areaCode: String,                   // Optional: Area/Zone code
  billAmount: Number,                 // Bill amount
  status: { type: String, default: "Unpaid" }, // Unpaid/Paid
  transactionId: String,              // Latest transaction ID
  paidAt: Date,                       // Payment date/time
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

module.exports = mongoose.model("waterbill", waterbillSchema);


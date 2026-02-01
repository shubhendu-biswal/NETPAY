const mongoose = require("mongoose");

const creditcardSchema = new mongoose.Schema({
  cardnumber: { type: String, required: true },      // Card Number
  holdername: { type: String, required: true },      // Name on Card
  cardProvider: { type: String, required: true },    // e.g. HDFC, SBI
  dueAmount: { type: Number, required: true },       // Bill Amount
  dueDate: { type: String, required: true },         // Due Date (string or Date)
  status: { type: String, default: "Unpaid" },       // Unpaid / Paid
  payments: [                                        // Payment History for this card
    {
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      transactionId: { type: String, required: true },
      status: { type: String, default: "Success" }   // Success / Failed
    }
  ]
});

module.exports = mongoose.model("creditcard", creditcardSchema);

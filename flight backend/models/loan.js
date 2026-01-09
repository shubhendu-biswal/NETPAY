const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  loanProvider: { type: String, required: true },
  accountNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  emiAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, default: "Unpaid" }, // Unpaid | Paid
  paymentDate: { type: Date },
});

module.exports = mongoose.model("Loan", LoanSchema);

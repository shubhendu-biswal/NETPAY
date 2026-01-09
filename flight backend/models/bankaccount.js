const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  ifsc: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["self", "other"], required: true },
  status: { type: String, enum: ["Success", "Failed"], default: "Success" },
  time: { type: Date, default: Date.now }
});

const bankAccountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  ifscCode: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  transactions: [transactionSchema]
});

module.exports = mongoose.model("BankAccount", bankAccountSchema);

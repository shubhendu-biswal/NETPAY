const mongoose = require("mongoose");

const dthRechargeSchema = new mongoose.Schema({
  operator: { type: String, required: true },
  customerId: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ["pending", "success", "failed",""], default: "" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("dthrecharge", dthRechargeSchema);

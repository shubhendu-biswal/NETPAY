const mongoose = require("mongoose");

// -------------------
// FASTag Recharge Schema
// -------------------
const fastagSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  provider: { type: String, required: true },
  customerId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "Success" }, // Always success for now
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FastagRecharge", fastagSchema);

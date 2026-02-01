const mongoose = require("mongoose");

const mobilerechargeSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true, match: /^[6-9]\d{9}$/ },
  operator: { type: String, required: true },
  circle: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ["pending", "success", "failed",""], default: "" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MobileRecharge", mobilerechargeSchema);

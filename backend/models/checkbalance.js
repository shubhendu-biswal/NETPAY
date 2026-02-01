const mongoose = require("mongoose");

const checkbalanceschema = new mongoose.Schema({
  bankname: { type: String, required: true, unique: true },
  accountnumber: { type: String, required: true, unique: true },
  pin: { type: String, required: true }, 
  balance: { type: Number, required: true }
});

module.exports = mongoose.model("checkbalance", checkbalanceschema);

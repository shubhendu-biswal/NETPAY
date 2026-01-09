const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: "User", // optional field
  },
  balance: {
    type: Number,
    default: 1000, // initial balance
  },
});

module.exports = mongoose.model("User", userSchema);

// models/bus.js
const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  operator: { type: String, required: true },
  busNumber: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureDate: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String },
  price: { type: Number, required: true },
  type: { type: String, enum: ["seater", "sleeper", "ac"], required: true },
  totalSeats: { type: Number, required: true },
});

// ✅ This line prevents OverwriteModelError
module.exports = mongoose.models.Bus || mongoose.model("Bus", busSchema);

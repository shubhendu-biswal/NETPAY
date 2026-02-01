const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema({
  trainName: { type: String, required: true },
  trainNumber: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureDate: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },   
  duration: { type: String },
  class: { type: String, enum: ["general", "sleeper", "ac"], required: true },
  passengers: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true }
});

module.exports = mongoose.model("Train", trainSchema);

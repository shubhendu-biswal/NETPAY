const mongoose = require("mongoose");

// Flight Schema
const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureDate: { type: String, required: true }, // You can also use Date type
  returnDate: { type: String }, // Optional
  time: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: String, required: true },
  class: { type: String, enum: ["Economy", "Business", "First"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Flight", flightSchema);

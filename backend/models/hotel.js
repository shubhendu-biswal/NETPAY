const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  hotelName: { type: String, required: true },
  city: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  rooms: { type: Number, required: true, default: 1 },
  guests: { type: Number, required: true, default: 1 },
  pricePerNight: { type: Number, required: true },
  amenities: { type: [String], default: [] }
});

module.exports = mongoose.model("Hotel", hotelSchema);

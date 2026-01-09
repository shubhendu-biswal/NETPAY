const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["flight", "train", "bus", "hotel"], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "type" },
  details: { type: Object }, // Optional extra info
  price: { type: Number, required: true },
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);

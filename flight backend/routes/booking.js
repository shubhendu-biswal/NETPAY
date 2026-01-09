const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// POST /bookings → Create a new booking
router.post("/", async (req, res) => {
  const { userId, type, itemId, details, price } = req.body;

  // Validate required fields
  if (!userId || !type || !itemId || !price) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const booking = await Booking.create({
      userId,
      type,      // "flight", "train", "bus", "hotel"
      itemId,    // ObjectId of the booked item
      details,   // Optional extra info (passengers, rooms, class, etc.)
      price
    });

    res.json({ success: true, message: "Booking successful", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Booking failed", error: err.message });
  }
});

// GET /bookings/:userId → Get all bookings for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

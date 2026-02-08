const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// POST /bookings → Create a new booking
router.post("/", bookingController.createBooking);

// GET /bookings/:userId → Get all bookings for a specific user
router.get("/:userId", bookingController.getUserBookings);

module.exports = router;

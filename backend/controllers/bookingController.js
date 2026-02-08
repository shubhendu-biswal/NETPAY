const Booking = require("../models/Booking");

// Create a new booking
exports.createBooking = async (req, res) => {
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

        res.status(201).json({ success: true, message: "Booking successful", booking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Booking failed", error: err.message });
    }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId });
        res.status(200).json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

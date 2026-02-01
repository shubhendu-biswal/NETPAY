// routes/hotels.js
const express = require("express");
const router = express.Router();
const Hotel = require("../models/hotel"); // Make sure your hotel model exists

// GET /api/hotels/search?city=...&hotelName=...
router.get("/search", async (req, res) => {
  const { city, hotelName } = req.query;

  console.log("📌 Hotel search query received:", { city, hotelName });

  try {
    // Build dynamic query
    const query = {};
    if (city) query.city = { $regex: new RegExp(`^${city.trim()}$`, "i") };
    if (hotelName)
      query.hotelName = { $regex: new RegExp(`${hotelName.trim()}`, "i") };

    // Require at least one search field
    if (Object.keys(query).length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide at least one search field" });
    }

    const hotels = await Hotel.find(query);

    console.log("✅ Hotels found:", hotels.length);
    res.json(hotels);
  } catch (err) {
    console.error("❌ Error fetching hotels:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

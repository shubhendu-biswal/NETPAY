// routes/trains.js
const express = require("express");
const router = express.Router();
const Train = require("../models/train");

// GET /api/trains/search?from=...&to=...&departureDate=...
router.get("/search", async (req, res) => {
  try {
    const { from, to, departureDate } = req.query;

    console.log("📌 Train search query:", { from, to, departureDate });

    // Build dynamic query
    const query = {};
    if (from) query.from = { $regex: new RegExp(`^${from.trim()}$`, "i") };
    if (to) query.to = { $regex: new RegExp(`^${to.trim()}$`, "i") };
    if (departureDate) {
      const searchDate = new Date(departureDate);
      const nextDay = new Date(searchDate);
      nextDay.setDate(searchDate.getDate() + 1);
      query.departureDate = { $gte: searchDate, $lt: nextDay };
    }

    // Require **at least one field**
    if (Object.keys(query).length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide at least one search field" });
    }

    const trains = await Train.find(query);

    console.log("✅ Trains found:", trains.length);
    res.json(trains);
  } catch (err) {
    console.error("❌ Error fetching trains:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

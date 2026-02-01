// routes/flights.js
const express = require("express");
const router = express.Router();
const Flight = require("../models/flight"); // Make sure the model exists

router.get("/search", async (req, res) => {
    let { from, to, departureDate } = req.query;

    console.log("Querying flights:", { from, to, departureDate });

    try {
        // Build dynamic query
        const query = {};
        if (from) query.from = { $regex: new RegExp(`^${from.trim()}$`, "i") };
        if (to) query.to = { $regex: new RegExp(`^${to.trim()}$`, "i") };
        if (departureDate) query.departureDate = departureDate.trim();

        // Require at least one search field
        if (Object.keys(query).length === 0) {
            return res.status(400).json({ message: "Please provide at least one search field" });
        }

        const flights = await Flight.find(query);

        console.log("Flights found:", flights);
        res.json(flights);
    } catch (err) {
        console.error("Error fetching flights:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

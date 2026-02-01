// routes/buses.js
const express = require("express");
const router = express.Router();
const Bus = require("../models/bus");

// GET /buses/search?from=...&to=...&departureDate=...
router.get("/search", async (req, res) => {
    let { from, to, departureDate } = req.query;

    console.log("Querying buses:", { from, to, departureDate });

    try {
        const query = {};
        if (from) query.from = { $regex: new RegExp(`^${from.trim()}$`, "i") };
        if (to) query.to = { $regex: new RegExp(`^${to.trim()}$`, "i") };
        if (departureDate) query.departureDate = departureDate.trim();

        if (Object.keys(query).length === 0) {
            return res.status(400).json({ message: "Please provide at least one search field" });
        }

        const buses = await Bus.find(query);

        console.log("Buses found:", buses);
        res.json(buses);
    } catch (err) {
        console.error("Error fetching buses:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

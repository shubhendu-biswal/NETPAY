const express = require("express");
const router = express.Router();
const Flight = require("../models/flight");
const Train = require("../models/train");
const Bus = require("../models/bus");
const Hotel = require("../models/hotel");

// GET /search/flights?from=...&to=...
router.get("/flights", async (req, res) => {
  const { from, to } = req.query;

  try {
    const flights = await Flight.find({
      from: { $regex: new RegExp(from, "i") },
      to: { $regex: new RegExp(to, "i") }
    });

    res.json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /search/trains?from=...&to=...
router.get("/trains", async (req, res) => {
  const { from, to } = req.query;

  try {
    const trains = await Train.find({
      from: { $regex: new RegExp(from, "i") },
      to: { $regex: new RegExp(to, "i") }
    });

    res.json(trains);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /search/buses?from=...&to=...
router.get("/buses", async (req, res) => {
  const { from, to } = req.query;

  try {
    const buses = await Bus.find({
      from: { $regex: new RegExp(from, "i") },
      to: { $regex: new RegExp(to, "i") }
    });

    res.json(buses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /search/hotels?location=...
router.get("/hotels", async (req, res) => {
  const { location } = req.query;

  try {
    const hotels = await Hotel.find({
      city: { $regex: new RegExp(location, "i") }
    });

    res.json(hotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

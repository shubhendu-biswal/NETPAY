const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Import models
const Flight = require("./models/flight");
const Train = require("./models/train");
const Bus = require("./models/bus");
const Hotel = require("./models/hotel");
const CreditCard = require("./models/creditcard");
const electricitybill = require("./models/electricitybill");
const waterbill = require("./models/waterbill");
const gasbill = require("./models/gasbill");
const mobilerecharge = require("./models/mobilerecharge");
const dthrecharge = require("./models/dthrecharge");
const fastag = require("./models/fastag");
const loan = require("./models/loan");
const bankaccount = require("./models/bankaccount");
const checkbalance = require("./models/checkbalance");


// ✅ Load MongoDB URI (force Atlas, no fallback)
if (!process.env.MONGO_URI) {
  throw new Error("❌ No MONGO_URI found in .env file!");
}
const MONGO_URI = process.env.MONGO_URI;
console.log("🔍 Using Mongo URI:", MONGO_URI);

// ✅ Helper for auto dates
function formatDate(date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function getAutoDates() {
  const today = new Date();

  const departure = new Date(today);
  departure.setDate(today.getDate() + Math.floor(Math.random() * 7) + 1); // 1–7 days later

  const returnDate = new Date(departure);
  returnDate.setDate(departure.getDate() + Math.floor(Math.random() * 7) + 2); // 2–9 days later

  return {
    departureDate: formatDate(departure),
    returnDate: formatDate(returnDate),
  };
}
    


// ✈️ Sample Flights
const flightData = [
{ airline: "Air India", flightNumber: "AI101", from: "Bengaluru", to: "Delhi", departureDate: "2025-10-01", returnDate: "2025-10-05", time: "06:00 AM", duration: "2h 30m", price: "₹4500", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E202", from: "Delhi", to: "Mumbai", departureDate: "2025-10-02", returnDate: "2025-10-06", time: "09:00 AM", duration: "2h", price: "₹4000", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG303", from: "Mumbai", to: "Goa", departureDate: "2025-10-03", returnDate: "2025-10-07", time: "11:00 AM", duration: "1h 15m", price: "₹3500", class: "Economy" },
{ airline: "GoAir", flightNumber: "G812", from: "Goa", to: "Bengaluru", departureDate: "2025-10-04", returnDate: "2025-10-08", time: "02:00 PM", duration: "1h 30m", price: "₹3800", class: "Economy" },
{ airline: "Air India", flightNumber: "AI404", from: "Chennai", to: "Delhi", departureDate: "2025-10-05", returnDate: "2025-10-09", time: "07:30 AM", duration: "2h 45m", price: "₹4700", class: "Business" },
{ airline: "IndiGo", flightNumber: "6E505", from: "Delhi", to: "Bengaluru", departureDate: "2025-10-06", returnDate: "2025-10-10", time: "06:00 PM", duration: "2h 30m", price: "₹4500", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG606", from: "Bengaluru", to: "Mumbai", departureDate: "2025-10-07", returnDate: "2025-10-11", time: "08:30 AM", duration: "2h", price: "₹4000", class: "First" },
{ airline: "GoAir", flightNumber: "G909", from: "Mumbai", to: "Delhi", departureDate: "2025-10-08", returnDate: "2025-10-12", time: "10:00 AM", duration: "2h", price: "₹4200", class: "Economy" },
{ airline: "Air India", flightNumber: "AI707", from: "Kolkata", to: "Bengaluru", departureDate: "2025-10-09", returnDate: "2025-10-13", time: "03:00 PM", duration: "3h 15m", price: "₹5000", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E808", from: "Bengaluru", to: "Goa", departureDate: "2025-10-10", returnDate: "2025-10-14", time: "11:00 AM", duration: "1h 30m", price: "₹3500", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG909", from: "Goa", to: "Delhi", departureDate: "2025-10-11", returnDate: "2025-10-15", time: "01:00 PM", duration: "2h 15m", price: "₹4500", class: "Business" },
{ airline: "GoAir", flightNumber: "G1010", from: "Delhi", to: "Mumbai", departureDate: "2025-10-12", returnDate: "2025-10-16", time: "09:00 AM", duration: "2h", price: "₹4000", class: "Economy" },
{ airline: "Air India", flightNumber: "AI111", from: "Mumbai", to: "Chennai", departureDate: "2025-10-13", returnDate: "2025-10-17", time: "07:00 AM", duration: "2h 30m", price: "₹4800", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E212", from: "Chennai", to: "Bengaluru", departureDate: "2025-10-14", returnDate: "2025-10-18", time: "06:00 PM", duration: "1h 30m", price: "₹3700", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG313", from: "Bengaluru", to: "Delhi", departureDate: "2025-10-15", returnDate: "2025-10-19", time: "10:30 AM", duration: "2h 30m", price: "₹4500", class: "Business" },
{ airline: "GoAir", flightNumber: "G414", from: "Delhi", to: "Goa", departureDate: "2025-10-16", returnDate: "2025-10-20", time: "02:00 PM", duration: "2h 15m", price: "₹4000", class: "Economy" },
{ airline: "Air India", flightNumber: "AI515", from: "Goa", to: "Mumbai", departureDate: "2025-10-17", returnDate: "2025-10-21", time: "09:00 AM", duration: "1h 15m", price: "₹3600", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E616", from: "Mumbai", to: "Bengaluru", departureDate: "2025-10-18", returnDate: "2025-10-22", time: "11:30 AM", duration: "2h", price: "₹4000", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG717", from: "Bengaluru", to: "Kolkata", departureDate: "2025-10-19", returnDate: "2025-10-23", time: "03:00 PM", duration: "3h", price: "₹4800", class: "Business" },
{ airline: "GoAir", flightNumber: "G818", from: "Kolkata", to: "Delhi", departureDate: "2025-10-20", returnDate: "2025-10-24", time: "06:00 AM", duration: "2h 15m", price: "₹4300", class: "Economy" },
{ airline: "Air India", flightNumber: "AI919", from: "Delhi", to: "Bengaluru", departureDate: "2025-10-21", returnDate: "2025-10-25", time: "07:30 AM", duration: "2h 30m", price: "₹4500", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E1020", from: "Bengaluru", to: "Goa", departureDate: "2025-10-22", returnDate: "2025-10-26", time: "09:00 AM", duration: "1h 30m", price: "₹3500", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG1121", from: "Goa", to: "Mumbai", departureDate: "2025-10-23", returnDate: "2025-10-27", time: "01:00 PM", duration: "1h 15m", price: "₹3600", class: "Business" },
{ airline: "GoAir", flightNumber: "G1222", from: "Mumbai", to: "Delhi", departureDate: "2025-10-24", returnDate: "2025-10-28", time: "10:00 AM", duration: "2h", price: "₹4200", class: "Economy" },
{ airline: "Air India", flightNumber: "AI1323", from: "Delhi", to: "Chennai", departureDate: "2025-10-25", returnDate: "2025-10-29", time: "06:00 AM", duration: "2h 45m", price: "₹4700", class: "Business" },
{ airline: "IndiGo", flightNumber: "6E1424", from: "Chennai", to: "Bengaluru", departureDate: "2025-10-26", returnDate: "2025-10-30", time: "08:30 AM", duration: "1h 30m", price: "₹3700", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG1525", from: "Bengaluru", to: "Delhi", departureDate: "2025-10-27", returnDate: "2025-10-31", time: "11:00 AM", duration: "2h 30m", price: "₹4500", class: "Business" },
{ airline: "GoAir", flightNumber: "G1626", from: "Delhi", to: "Goa", departureDate: "2025-10-28", returnDate: "2025-11-01", time: "02:30 PM", duration: "2h 15m", price: "₹4000", class: "Economy" },
{ airline: "Air India", flightNumber: "AI1727", from: "Goa", to: "Mumbai", departureDate: "2025-10-29", returnDate: "2025-11-02", time: "09:00 AM", duration: "1h 15m", price: "₹3600", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E1828", from: "Mumbai", to: "Bengaluru", departureDate: "2025-10-30", returnDate: "2025-11-03", time: "11:30 AM", duration: "2h", price: "₹4000", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG1929", from: "Bengaluru", to: "Kolkata", departureDate: "2025-10-31", returnDate: "2025-11-04", time: "03:00 PM", duration: "3h", price: "₹4800", class: "Business" },
{ airline: "GoAir", flightNumber: "G2030", from: "Kolkata", to: "Delhi", departureDate: "2025-11-01", returnDate: "2025-11-05", time: "06:00 AM", duration: "2h 15m", price: "₹4300", class: "Economy" },
{ airline: "Air India", flightNumber: "AI2131", from: "Delhi", to: "Bengaluru", departureDate: "2025-11-02", returnDate: "2025-11-06", time: "07:30 AM", duration: "2h 30m", price: "₹4500", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E2232", from: "Bengaluru", to: "Goa", departureDate: "2025-11-03", returnDate: "2025-11-07", time: "09:00 AM", duration: "1h 30m", price: "₹3500", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG2333", from: "Goa", to: "Mumbai", departureDate: "2025-11-04", returnDate: "2025-11-08", time: "01:00 PM", duration: "1h 15m", price: "₹3600", class: "Business" },
{ airline: "GoAir", flightNumber: "G2434", from: "Mumbai", to: "Delhi", departureDate: "2025-11-05", returnDate: "2025-11-09", time: "10:00 AM", duration: "2h", price: "₹4200", class: "Economy" },
{ airline: "Air India", flightNumber: "AI2535", from: "Delhi", to: "Chennai", departureDate: "2025-11-06", returnDate: "2025-11-10", time: "06:00 AM", duration: "2h 45m", price: "₹4700", class: "Business" },
{ airline: "IndiGo", flightNumber: "6E2636", from: "Chennai", to: "Bengaluru", departureDate: "2025-11-07", returnDate: "2025-11-11", time: "08:30 AM", duration: "1h 30m", price: "₹3700", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG2737", from: "Bengaluru", to: "Delhi", departureDate: "2025-11-08", returnDate: "2025-11-12", time: "11:00 AM", duration: "2h 30m", price: "₹4500", class: "Business" },
{ airline: "GoAir", flightNumber: "G2838", from: "Delhi", to: "Goa", departureDate: "2025-11-09", returnDate: "2025-11-13", time: "02:30 PM", duration: "2h 15m", price: "₹4000", class: "Economy" },
{ airline: "Air India", flightNumber: "AI2939", from: "Goa", to: "Mumbai", departureDate: "2025-11-10", returnDate: "2025-11-14", time: "09:00 AM", duration: "1h 15m", price: "₹3600", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E3040", from: "Mumbai", to: "Bengaluru", departureDate: "2025-11-11", returnDate: "2025-11-15", time: "11:30 AM", duration: "2h", price: "₹4000", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG3141", from: "Bengaluru", to: "Kolkata", departureDate: "2025-11-12", returnDate: "2025-11-16", time: "03:00 PM", duration: "3h", price: "₹4800", class: "Business" },
{ airline: "GoAir", flightNumber: "G3242", from: "Kolkata", to: "Delhi", departureDate: "2025-11-13", returnDate: "2025-11-17", time: "06:00 AM", duration: "2h 15m", price: "₹4300", class: "Economy" },
{ airline: "Air India", flightNumber: "AI3343", from: "Delhi", to: "Bengaluru", departureDate: "2025-11-14", returnDate: "2025-11-18", time: "07:30 AM", duration: "2h 30m", price: "₹4500", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E3444", from: "Bengaluru", to: "Goa", departureDate: "2025-11-15", returnDate: "2025-11-19", time: "09:00 AM", duration: "1h 30m", price: "₹3500", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG3545", from: "Goa", to: "Mumbai", departureDate: "2025-11-16", returnDate: "2025-11-20", time: "01:00 PM", duration: "1h 15m", price: "₹3600", class: "Business" },
{ airline: "GoAir", flightNumber: "G3646", from: "Mumbai", to: "Delhi", departureDate: "2025-11-17", returnDate: "2025-11-21", time: "10:00 AM", duration: "2h", price: "₹4200", class: "Economy" },
{ airline: "Air India", flightNumber: "AI3747", from: "Delhi", to: "Chennai", departureDate: "2025-11-18", returnDate: "2025-11-22", time: "06:00 AM", duration: "2h 45m", price: "₹4700", class: "Business" },
{ airline: "IndiGo", flightNumber: "6E3848", from: "Chennai", to: "Bengaluru", departureDate: "2025-11-19", returnDate: "2025-11-23", time: "08:30 AM", duration: "1h 30m", price: "₹3700", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG3949", from: "Bengaluru", to: "Delhi", departureDate: "2025-11-20", returnDate: "2025-11-24", time: "11:00 AM", duration: "2h 30m", price: "₹4500", class: "Business" },
{ airline: "GoAir", flightNumber: "G4050", from: "Delhi", to: "Goa", departureDate: "2025-11-21", returnDate: "2025-11-25", time: "02:30 PM", duration: "2h 15m", price: "₹4000", class: "Economy" },
{ airline: "Air India", flightNumber: "AI4151", from: "Goa", to: "Mumbai", departureDate: "2025-11-22", returnDate: "2025-11-26", time: "09:00 AM", duration: "1h 15m", price: "₹3600", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E4252", from: "Mumbai", to: "Bengaluru", departureDate: "2025-11-23", returnDate: "2025-11-27", time: "11:30 AM", duration: "2h", price: "₹4000", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG4353", from: "Bengaluru", to: "Kolkata", departureDate: "2025-11-24", returnDate: "2025-11-28", time: "03:00 PM", duration: "3h", price: "₹4800", class: "Business" },
{ airline: "GoAir", flightNumber: "G4454", from: "Kolkata", to: "Delhi", departureDate: "2025-11-25", returnDate: "2025-11-29", time: "06:00 AM", duration: "2h 15m", price: "₹4300", class: "Economy" },
{ airline: "Air India", flightNumber: "AI4555", from: "Delhi", to: "Bengaluru", departureDate: "2025-11-26", returnDate: "2025-11-30", time: "07:30 AM", duration: "2h 30m", price: "₹4500", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E4656", from: "Bengaluru", to: "Goa", departureDate: "2025-11-27", returnDate: "2025-12-01", time: "09:00 AM", duration: "1h 30m", price: "₹3500", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG4757", from: "Goa", to: "Mumbai", departureDate: "2025-11-28", returnDate: "2025-12-02", time: "01:00 PM", duration: "1h 15m", price: "₹3600", class: "Business" },
{ airline: "GoAir", flightNumber: "G4858", from: "Mumbai", to: "Delhi", departureDate: "2025-11-29", returnDate: "2025-12-03", time: "10:00 AM", duration: "2h", price: "₹4200", class: "Economy" },
{ airline: "Air India", flightNumber: "AI4959", from: "Delhi", to: "Chennai", departureDate: "2025-11-30", returnDate: "2025-12-04", time: "06:00 AM", duration: "2h 45m", price: "₹4700", class: "Business" },
{ airline: "IndiGo", flightNumber: "6E5060", from: "Chennai", to: "Bengaluru", departureDate: "2025-12-01", returnDate: "2025-12-05", time: "08:30 AM", duration: "1h 30m", price: "₹3700", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG5161", from: "Bengaluru", to: "Delhi", departureDate: "2025-12-02", returnDate: "2025-12-06", time: "11:00 AM", duration: "2h 30m", price: "₹4500", class: "Business" },
{ airline: "GoAir", flightNumber: "G5262", from: "Delhi", to: "Goa", departureDate: "2025-12-03", returnDate: "2025-12-07", time: "02:30 PM", duration: "2h 15m", price: "₹4000", class: "Economy" },
{ airline: "Air India", flightNumber: "AI5363", from: "Goa", to: "Mumbai", departureDate: "2025-12-04", returnDate: "2025-12-08", time: "09:00 AM", duration: "1h 15m", price: "₹3600", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E5464", from: "Mumbai", to: "Bengaluru", departureDate: "2025-12-05", returnDate: "2025-12-09", time: "11:30 AM", duration: "2h", price: "₹4000", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG5565", from: "Bengaluru", to: "Kolkata", departureDate: "2025-12-06", returnDate: "2025-12-10", time: "03:00 PM", duration: "3h", price: "₹4800", class: "Business" },
{ airline: "GoAir", flightNumber: "G5666", from: "Kolkata", to: "Delhi", departureDate: "2025-12-07", returnDate: "2025-12-11", time: "06:00 AM", duration: "2h 15m", price: "₹4300", class: "Economy" },
{ airline: "Air India", flightNumber: "AI5767", from: "Delhi", to: "Bengaluru", departureDate: "2025-12-08", returnDate: "2025-12-12", time: "07:30 AM", duration: "2h 30m", price: "₹4500", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E5868", from: "Bengaluru", to: "Goa", departureDate: "2025-12-09", returnDate: "2025-12-13", time: "09:00 AM", duration: "1h 30m", price: "₹3500", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG5969", from: "Goa", to: "Mumbai", departureDate: "2025-12-10", returnDate: "2025-12-14", time: "01:00 PM", duration: "1h 15m", price: "₹3600", class: "Business" },
{ airline: "GoAir", flightNumber: "G6070", from: "Mumbai", to: "Delhi", departureDate: "2025-12-11", returnDate: "2025-12-15", time: "10:00 AM", duration: "2h", price: "₹4200", class: "Economy" },
{ airline: "Air India", flightNumber: "AI6171", from: "Delhi", to: "Chennai", departureDate: "2025-12-12", returnDate: "2025-12-16", time: "06:00 AM", duration: "2h 45m", price: "₹4700", class: "Business" },
{ airline: "IndiGo", flightNumber: "6E6272", from: "Chennai", to: "Bengaluru", departureDate: "2025-12-13", returnDate: "2025-12-17", time: "08:30 AM", duration: "1h 30m", price: "₹3700", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG6373", from: "Bengaluru", to: "Delhi", departureDate: "2025-12-14", returnDate: "2025-12-18", time: "11:00 AM", duration: "2h 30m", price: "₹4500", class: "Business" },
{ airline: "GoAir", flightNumber: "G6474", from: "Delhi", to: "Goa", departureDate: "2025-12-15", returnDate: "2025-12-19", time: "02:30 PM", duration: "2h 15m", price: "₹4000", class: "Economy" },
{ airline: "Air India", flightNumber: "AI6575", from: "Goa", to: "Mumbai", departureDate: "2025-12-16", returnDate: "2025-12-20", time: "09:00 AM", duration: "1h 15m", price: "₹3600", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E6676", from: "Mumbai", to: "Bengaluru", departureDate: "2025-12-17", returnDate: "2025-12-21", time: "11:30 AM", duration: "2h", price: "₹4000", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG6777", from: "Bengaluru", to: "Kolkata", departureDate: "2025-12-18", returnDate: "2025-12-22", time: "03:00 PM", duration: "3h", price: "₹4800", class: "Business" },
{ airline: "GoAir", flightNumber: "G6878", from: "Kolkata", to: "Delhi", departureDate: "2025-12-19", returnDate: "2025-12-23", time: "06:00 AM", duration: "2h 15m", price: "₹4300", class: "Economy" },
{ airline: "Air India", flightNumber: "AI6979", from: "Delhi", to: "Bengaluru", departureDate: "2025-12-20", returnDate: "2025-12-24", time: "07:30 AM", duration: "2h 30m", price: "₹4500", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E7080", from: "Bengaluru", to: "Goa", departureDate: "2025-12-21", returnDate: "2025-12-25", time: "09:00 AM", duration: "1h 30m", price: "₹3500", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG7181", from: "Goa", to: "Mumbai", departureDate: "2025-12-22", returnDate: "2025-12-26", time: "01:00 PM", duration: "1h 15m", price: "₹3600", class: "Business" },
{ airline: "GoAir", flightNumber: "G7282", from: "Mumbai", to: "Delhi", departureDate: "2025-12-23", returnDate: "2025-12-27", time: "10:00 AM", duration: "2h", price: "₹4200", class: "Economy" },
{ airline: "Air India", flightNumber: "AI7383", from: "Delhi", to: "Chennai", departureDate: "2025-12-24", returnDate: "2025-12-28", time: "06:00 AM", duration: "2h 45m", price: "₹4700", class: "Business" },
{ airline: "IndiGo", flightNumber: "6E7484", from: "Chennai", to: "Bengaluru", departureDate: "2025-12-25", returnDate: "2025-12-29", time: "08:30 AM", duration: "1h 30m", price: "₹3700", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG7585", from: "Bengaluru", to: "Delhi", departureDate: "2025-12-26", returnDate: "2025-12-30", time: "11:00 AM", duration: "2h 30m", price: "₹4500", class: "Business" },
{ airline: "GoAir", flightNumber: "G7686", from: "Delhi", to: "Goa", departureDate: "2025-12-27", returnDate: "2025-12-31", time: "02:30 PM", duration: "2h 15m", price: "₹4000", class: "Economy" },
{ airline: "Air India", flightNumber: "AI7787", from: "Goa", to: "Mumbai", departureDate: "2025-12-28", returnDate: "2026-01-01", time: "09:00 AM", duration: "1h 15m", price: "₹3600", class: "Economy" },
{ airline: "IndiGo", flightNumber: "6E7888", from: "Mumbai", to: "Bengaluru", departureDate: "2025-12-29", returnDate: "2026-01-02", time: "11:30 AM", duration: "2h", price: "₹4000", class: "Economy" },
{ airline: "SpiceJet", flightNumber: "SG7989", from: "Bengaluru", to: "Kolkata", departureDate: "2025-12-30", returnDate: "2026-01-03", time: "03:00 PM", duration: "3h", price: "₹4800", class: "Business" },
{ airline: "GoAir", flightNumber: "G8090", from: "Kolkata", to: "Delhi", departureDate: "2025-12-31", returnDate: "2026-01-04", time: "06:00 AM", duration: "2h 15m", price: "₹4300", class: "Economy" }
];


// 🚆 Sample Trains

const trainData = [
{ trainName: "Shatabdi Express", trainNumber: "10000", from: "Delhi", to: "Bhopal", departureDate: new Date("2025-10-01"), departureTime: "06:00 AM", arrivalTime: "02:00 PM", class: "ac", passengers: 1, price: 1200 },
{ trainName: "Rajdhani Express", trainNumber: "10001", from: "Mumbai", to: "Delhi", departureDate: new Date("2025-10-02"), departureTime: "08:00 PM", arrivalTime: "08:00 AM", class: "ac", passengers: 1, price: 2500 },
{ trainName: "Duronto Express", trainNumber: "10002", from: "Kolkata", to: "Mumbai", departureDate: new Date("2025-10-03"), departureTime: "05:00 PM", arrivalTime: "07:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Garib Rath", trainNumber: "10003", from: "Delhi", to: "Bhubaneswar", departureDate: new Date("2025-10-04"), departureTime: "07:30 AM", arrivalTime: "07:30 PM", class: "sleeper", passengers: 1, price: 800 },
{ trainName: "Sampark Kranti", trainNumber: "10004", from: "Chennai", to: "Delhi", departureDate: new Date("2025-10-05"), departureTime: "06:00 PM", arrivalTime: "06:00 AM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Jan Shatabdi", trainNumber: "10005", from: "Bengaluru", to: "Mysuru", departureDate: new Date("2025-10-06"), departureTime: "07:00 AM", arrivalTime: "10:00 AM", class: "ac", passengers: 1, price: 900 },
{ trainName: "Intercity Express", trainNumber: "10006", from: "Delhi", to: "Agra", departureDate: new Date("2025-10-07"), departureTime: "06:30 AM", arrivalTime: "09:30 AM", class: "ac", passengers: 1, price: 700 },
{ trainName: "Kanchanjunga Express", trainNumber: "10007", from: "Sealdah", to: "Agartala", departureDate: new Date("2025-10-08"), departureTime: "05:45 PM", arrivalTime: "09:00 AM", class: "ac", passengers: 1, price: 2000 },
{ trainName: "Howrah Mail", trainNumber: "10008", from: "Kolkata", to: "Mumbai", departureDate: new Date("2025-10-09"), departureTime: "10:00 PM", arrivalTime: "10:00 AM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Kolkata Express", trainNumber: "10009", from: "Kolkata", to: "Delhi", departureDate: new Date("2025-10-10"), departureTime: "07:00 AM", arrivalTime: "07:00 PM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Shalimar Express", trainNumber: "10010", from: "Kolkata", to: "Amritsar", departureDate: new Date("2025-10-11"), departureTime: "04:00 PM", arrivalTime: "06:00 AM", class: "ac", passengers: 1, price: 2400 },
{ trainName: "Tamil Nadu Express", trainNumber: "10011", from: "Chennai", to: "New Delhi", departureDate: new Date("2025-10-12"), departureTime: "05:00 PM", arrivalTime: "08:00 AM", class: "ac", passengers: 1, price: 2600 },
{ trainName: "Coromandel Express", trainNumber: "10012", from: "Chennai", to: "Howrah", departureDate: new Date("2025-10-13"), departureTime: "06:15 AM", arrivalTime: "06:30 PM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Lucknow Express", trainNumber: "10013", from: "Lucknow", to: "Delhi", departureDate: new Date("2025-10-14"), departureTime: "08:00 AM", arrivalTime: "02:00 PM", class: "sleeper", passengers: 1, price: 900 },
{ trainName: "Swarna Jayanti Express", trainNumber: "10014", from: "Bhubaneswar", to: "Delhi", departureDate: new Date("2025-10-15"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Godavari Express", trainNumber: "10015", from: "Visakhapatnam", to: "Mumbai", departureDate: new Date("2025-10-16"), departureTime: "04:00 PM", arrivalTime: "06:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Coimbatore Express", trainNumber: "10016", from: "Coimbatore", to: "Chennai", departureDate: new Date("2025-10-17"), departureTime: "07:30 AM", arrivalTime: "04:30 PM", class: "ac", passengers: 1, price: 1800 },
{ trainName: "Kanyakumari Express", trainNumber: "10017", from: "Kanyakumari", to: "Chennai", departureDate: new Date("2025-10-18"), departureTime: "05:30 PM", arrivalTime: "06:00 AM", class: "ac", passengers: 1, price: 2000 },
{ trainName: "Bangalore Express", trainNumber: "10018", from: "Bengaluru", to: "Howrah", departureDate: new Date("2025-10-19"), departureTime: "06:00 AM", arrivalTime: "10:00 PM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Chennai Express", trainNumber: "10019", from: "Chennai", to: "Mumbai", departureDate: new Date("2025-10-20"), departureTime: "05:00 PM", arrivalTime: "07:00 AM", class: "ac", passengers: 1, price: 2500 },
{ trainName: "Mumbai Express", trainNumber: "10020", from: "Mumbai", to: "Chennai", departureDate: new Date("2025-10-21"), departureTime: "07:00 AM", arrivalTime: "09:00 PM", class: "ac", passengers: 1, price: 2400 },
{ trainName: "Hyderabad Express", trainNumber: "10021", from: "Hyderabad", to: "Delhi", departureDate: new Date("2025-10-22"), departureTime: "06:30 PM", arrivalTime: "06:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Nagpur Express", trainNumber: "10022", from: "Nagpur", to: "Mumbai", departureDate: new Date("2025-10-23"), departureTime: "08:00 AM", arrivalTime: "04:00 PM", class: "ac", passengers: 1, price: 1800 },
{ trainName: "Patna Express", trainNumber: "10023", from: "Patna", to: "Delhi", departureDate: new Date("2025-10-24"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Varanasi Express", trainNumber: "10024", from: "Varanasi", to: "Delhi", departureDate: new Date("2025-10-25"), departureTime: "06:00 AM", arrivalTime: "04:00 PM", class: "sleeper", passengers: 1, price: 900 },
{ trainName: "Jaipur Express", trainNumber: "10025", from: "Jaipur", to: "Delhi", departureDate: new Date("2025-10-26"), departureTime: "07:00 AM", arrivalTime: "12:00 PM", class: "ac", passengers: 1, price: 1500 },
{ trainName: "Ahmedabad Express", trainNumber: "10026", from: "Ahmedabad", to: "Delhi", departureDate: new Date("2025-10-27"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Lucknow Mail", trainNumber: "10027", from: "Lucknow", to: "Mumbai", departureDate: new Date("2025-10-28"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Kolkata Mail", trainNumber: "10028", from: "Kolkata", to: "Delhi", departureDate: new Date("2025-10-29"), departureTime: "05:30 PM", arrivalTime: "05:30 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Siliguri Express", trainNumber: "10029", from: "Siliguri", to: "Delhi", departureDate: new Date("2025-10-30"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Bhubaneswar Express", trainNumber: "10030", from: "Bhubaneswar", to: "Mumbai", departureDate: new Date("2025-10-31"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Nagpur Mail", trainNumber: "10031", from: "Nagpur", to: "Delhi", departureDate: new Date("2025-11-01"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Bengaluru Express", trainNumber: "10032", from: "Bengaluru", to: "Delhi", departureDate: new Date("2025-11-02"), departureTime: "07:00 AM", arrivalTime: "07:00 PM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Chennai Express", trainNumber: "10033", from: "Chennai", to: "Delhi", departureDate: new Date("2025-11-03"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2500 },
{ trainName: "Mumbai Express", trainNumber: "10034", from: "Mumbai", to: "Delhi", departureDate: new Date("2025-11-04"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2400 },
{ trainName: "Hyderabad Express", trainNumber: "10035", from: "Hyderabad", to: "Delhi", departureDate: new Date("2025-11-05"), departureTime: "06:30 PM", arrivalTime: "06:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Nagpur Express", trainNumber: "10036", from: "Nagpur", to: "Delhi", departureDate: new Date("2025-11-06"), departureTime: "08:00 AM", arrivalTime: "04:00 PM", class: "ac", passengers: 1, price: 1800 },
{ trainName: "Patna Express", trainNumber: "10037", from: "Patna", to: "Delhi", departureDate: new Date("2025-11-07"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Varanasi Express", trainNumber: "10038", from: "Varanasi", to: "Delhi", departureDate: new Date("2025-11-08"), departureTime: "06:00 AM", arrivalTime: "04:00 PM", class: "sleeper", passengers: 1, price: 900 },
{ trainName: "Jaipur Express", trainNumber: "10039", from: "Jaipur", to: "Delhi", departureDate: new Date("2025-11-09"), departureTime: "07:00 AM", arrivalTime: "12:00 PM", class: "ac", passengers: 1, price: 1500 },
{ trainName: "Ahmedabad Express", trainNumber: "10040", from: "Ahmedabad", to: "Mumbai", departureDate: new Date("2025-11-10"), departureTime: "05:00 PM", arrivalTime: "11:00 PM", class: "ac", passengers: 1, price: 2000 },
{ trainName: "Lucknow Mail", trainNumber: "10041", from: "Lucknow", to: "Chennai", departureDate: new Date("2025-11-11"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Kolkata Mail", trainNumber: "10042", from: "Kolkata", to: "Bhubaneswar", departureDate: new Date("2025-11-12"), departureTime: "05:30 PM", arrivalTime: "05:30 AM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Siliguri Express", trainNumber: "10043", from: "Siliguri", to: "Kolkata", departureDate: new Date("2025-11-13"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 1900 },
{ trainName: "Bhubaneswar Express", trainNumber: "10044", from: "Bhubaneswar", to: "Kolkata", departureDate: new Date("2025-11-14"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Nagpur Mail", trainNumber: "10045", from: "Nagpur", to: "Bengaluru", departureDate: new Date("2025-11-15"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Bengaluru Express", trainNumber: "10046", from: "Bengaluru", to: "Mumbai", departureDate: new Date("2025-11-16"), departureTime: "07:00 AM", arrivalTime: "07:00 PM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Chennai Express", trainNumber: "10047", from: "Chennai", to: "Bengaluru", departureDate: new Date("2025-11-17"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2500 },
{ trainName: "Mumbai Express", trainNumber: "10048", from: "Mumbai", to: "Bengaluru", departureDate: new Date("2025-11-18"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2400 },
{ trainName: "Hyderabad Express", trainNumber: "10049", from: "Hyderabad", to: "Bengaluru", departureDate: new Date("2025-11-19"), departureTime: "06:30 PM", arrivalTime: "06:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Nagpur Express", trainNumber: "10050", from: "Nagpur", to: "Chennai", departureDate: new Date("2025-11-20"), departureTime: "08:00 AM", arrivalTime: "04:00 PM", class: "ac", passengers: 1, price: 1800 },
{ trainName: "Patna Express", trainNumber: "10051", from: "Patna", to: "Chennai", departureDate: new Date("2025-11-21"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Varanasi Express", trainNumber: "10052", from: "Varanasi", to: "Bhubaneswar", departureDate: new Date("2025-11-22"), departureTime: "06:00 AM", arrivalTime: "04:00 PM", class: "sleeper", passengers: 1, price: 900 },
{ trainName: "Jaipur Express", trainNumber: "10053", from: "Jaipur", to: "Mumbai", departureDate: new Date("2025-11-23"), departureTime: "07:00 AM", arrivalTime: "12:00 PM", class: "ac", passengers: 1, price: 1500 },
{ trainName: "Ahmedabad Express", trainNumber: "10054", from: "Ahmedabad", to: "Bhubaneswar", departureDate: new Date("2025-11-24"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Lucknow Mail", trainNumber: "10055", from: "Lucknow", to: "Bhubaneswar", departureDate: new Date("2025-11-25"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Kolkata Mail", trainNumber: "10056", from: "Kolkata", to: "Bengaluru", departureDate: new Date("2025-11-26"), departureTime: "05:30 PM", arrivalTime: "05:30 AM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Siliguri Express", trainNumber: "10057", from: "Siliguri", to: "Bhubaneswar", departureDate: new Date("2025-11-27"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 1900 },
{ trainName: "Bhubaneswar Express", trainNumber: "10058", from: "Bhubaneswar", to: "Mumbai", departureDate: new Date("2025-11-28"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Nagpur Mail", trainNumber: "10059", from: "Nagpur", to: "Bhubaneswar", departureDate: new Date("2025-11-29"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Bengaluru Express", trainNumber: "10060", from: "Bengaluru", to: "Bhubaneswar", departureDate: new Date("2025-11-30"), departureTime: "07:00 AM", arrivalTime: "07:00 PM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Chennai Express", trainNumber: "10061", from: "Chennai", to: "Bhubaneswar", departureDate: new Date("2025-12-01"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2500 },
{ trainName: "Mumbai Express", trainNumber: "10062", from: "Mumbai", to: "Bhubaneswar", departureDate: new Date("2025-12-02"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2400 },
{ trainName: "Hyderabad Express", trainNumber: "10063", from: "Hyderabad", to: "Bhubaneswar", departureDate: new Date("2025-12-03"), departureTime: "06:30 PM", arrivalTime: "06:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Nagpur Express", trainNumber: "10064", from: "Nagpur", to: "Bengaluru", departureDate: new Date("2025-12-04"), departureTime: "08:00 AM", arrivalTime: "04:00 PM", class: "ac", passengers: 1, price: 1800 },
{ trainName: "Patna Express", trainNumber: "10065", from: "Patna", to: "Bengaluru", departureDate: new Date("2025-12-05"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Varanasi Express", trainNumber: "10066", from: "Varanasi", to: "Bengaluru", departureDate: new Date("2025-12-06"), departureTime: "06:00 AM", arrivalTime: "04:00 PM", class: "sleeper", passengers: 1, price: 900 },
{ trainName: "Jaipur Express", trainNumber: "10067", from: "Jaipur", to: "Bhubaneswar", departureDate: new Date("2025-12-07"), departureTime: "07:00 AM", arrivalTime: "12:00 PM", class: "ac", passengers: 1, price: 1500 },
{ trainName: "Ahmedabad Express", trainNumber: "10068", from: "Ahmedabad", to: "Bengaluru", departureDate: new Date("2025-12-08"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Lucknow Mail", trainNumber: "10069", from: "Lucknow", to: "Bengaluru", departureDate: new Date("2025-12-09"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Kolkata Mail", trainNumber: "10070", from: "Kolkata", to: "Mumbai", departureDate: new Date("2025-12-10"), departureTime: "05:30 PM", arrivalTime: "05:30 AM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Siliguri Express", trainNumber: "10071", from: "Siliguri", to: "Mumbai", departureDate: new Date("2025-12-11"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 1900 },
{ trainName: "Bhubaneswar Express", trainNumber: "10072", from: "Bhubaneswar", to: "Bengaluru", departureDate: new Date("2025-12-12"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Nagpur Mail", trainNumber: "10073", from: "Nagpur", to: "Mumbai", departureDate: new Date("2025-12-13"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Bengaluru Express", trainNumber: "10074", from: "Bengaluru", to: "Mumbai", departureDate: new Date("2025-12-14"), departureTime: "07:00 AM", arrivalTime: "07:00 PM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Chennai Express", trainNumber: "10075", from: "Chennai", to: "Mumbai", departureDate: new Date("2025-12-15"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2500 },
{ trainName: "Mumbai Express", trainNumber: "10076", from: "Mumbai", to: "Chennai", departureDate: new Date("2025-12-16"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2400 },
{ trainName: "Hyderabad Express", trainNumber: "10077", from: "Hyderabad", to: "Mumbai", departureDate: new Date("2025-12-17"), departureTime: "06:30 PM", arrivalTime: "06:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Nagpur Express", trainNumber: "10078", from: "Nagpur", to: "Chennai", departureDate: new Date("2025-12-18"), departureTime: "08:00 AM", arrivalTime: "04:00 PM", class: "ac", passengers: 1, price: 1800 },
{ trainName: "Patna Express", trainNumber: "10079", from: "Patna", to: "Chennai", departureDate: new Date("2025-12-19"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Varanasi Express", trainNumber: "10080", from: "Varanasi", to: "Mumbai", departureDate: new Date("2025-12-20"), departureTime: "06:00 AM", arrivalTime: "04:00 PM", class: "sleeper", passengers: 1, price: 900 },
{ trainName: "Jaipur Express", trainNumber: "10081", from: "Jaipur", to: "Chennai", departureDate: new Date("2025-12-21"), departureTime: "07:00 AM", arrivalTime: "12:00 PM", class: "ac", passengers: 1, price: 1500 },
{ trainName: "Ahmedabad Express", trainNumber: "10082", from: "Ahmedabad", to: "Chennai", departureDate: new Date("2025-12-22"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Lucknow Mail", trainNumber: "10083", from: "Lucknow", to: "Mumbai", departureDate: new Date("2025-12-23"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Kolkata Mail", trainNumber: "10084", from: "Kolkata", to: "Chennai", departureDate: new Date("2025-12-24"), departureTime: "05:30 PM", arrivalTime: "05:30 AM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Siliguri Express", trainNumber: "10085", from: "Siliguri", to: "Chennai", departureDate: new Date("2025-12-25"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 1900 },
{ trainName: "Bhubaneswar Express", trainNumber: "10086", from: "Bhubaneswar", to: "Chennai", departureDate: new Date("2025-12-26"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2200 },
{ trainName: "Nagpur Mail", trainNumber: "10087", from: "Nagpur", to: "Chennai", departureDate: new Date("2025-12-27"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2100 },
{ trainName: "Bengaluru Express", trainNumber: "10088", from: "Bengaluru", to: "Chennai", departureDate: new Date("2025-12-28"), departureTime: "07:00 AM", arrivalTime: "07:00 PM", class: "ac", passengers: 1, price: 2300 },
{ trainName: "Chennai Express", trainNumber: "10089", from: "Chennai", to: "Delhi", departureDate: new Date("2025-12-29"), departureTime: "05:00 PM", arrivalTime: "05:00 AM", class: "ac", passengers: 1, price: 2500 },
{ trainName: "Mumbai Express", trainNumber: "10090", from: "Mumbai", to: "Delhi", departureDate: new Date("2025-12-30"), departureTime: "06:00 AM", arrivalTime: "06:00 PM", class: "ac", passengers: 1, price: 2400 },
{ trainName: "Hyderabad Express", trainNumber: "10091", from: "Hyderabad", to: "Delhi", departureDate: new Date("2025-12-31"), departureTime: "06:30 PM", arrivalTime: "06:00 AM", class: "ac", passengers: 1, price: 2200 }


];


// 🚌 Sample Buses
const busData = [
{ operator: "Volvo Travels", busNumber: "KA01AB1234", from: "Bengaluru", to: "Chennai", departureDate: "2025-09-15", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1200, type: "ac", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "KA02BC2345", from: "Bhubaneswar", to: "Mumbai", departureDate: "2025-09-15", time: "07:00 AM - 07:00 PM", duration: "12h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "SRS Travels", busNumber: "KA03CD3456", from: "Bengaluru", to: "Hyderabad", departureDate: "2025-09-16", time: "08:00 AM - 04:00 PM", duration: "8h", price: 1300, type: "sleeper", totalSeats: 40 },
{ operator: "KSRTC", busNumber: "KA04DE4567", from: "Bengaluru", to: "Pune", departureDate: "2025-09-16", time: "05:00 PM - 01:00 AM", duration: "8h", price: 1400, type: "ac", totalSeats: 40 },
{ operator: "Shivshakti Travels", busNumber: "KA05EF5678", from: "Mumbai", to: "Goa", departureDate: "2025-09-17", time: "06:00 AM - 12:00 PM", duration: "6h", price: 900, type: "seater", totalSeats: 40 },
{ operator: "Neeta Travels", busNumber: "MH01GH6789", from: "Mumbai", to: "Pune", departureDate: "2025-09-17", time: "07:00 AM - 11:00 AM", duration: "4h", price: 600, type: "ac", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "MH02HI7890", from: "Mumbai", to: "Bengaluru", departureDate: "2025-09-18", time: "08:00 PM - 08:00 AM", duration: "12h", price: 1600, type: "sleeper", totalSeats: 40 },
{ operator: "Orange Tours", busNumber: "MH03IJ8901", from: "Pune", to: "Goa", departureDate: "2025-09-18", time: "06:00 AM - 12:00 PM", duration: "6h", price: 800, type: "seater", totalSeats: 40 },
{ operator: "KSRTC", busNumber: "KA06JK9012", from: "Chennai", to: "Bhubaneswar", departureDate: "2025-09-19", time: "05:00 AM - 01:00 PM", duration: "8h", price: 1200, type: "ac", totalSeats: 40 },
{ operator: "SRS Travels", busNumber: "TN01KL0123", from: "Chennai", to: "Hyderabad", departureDate: "2025-09-19", time: "06:00 PM - 06:00 AM", duration: "12h", price: 1400, type: "sleeper", totalSeats: 40 },
{ operator: "Volvo Travels", busNumber: "KA07LM1234", from: "Bengaluru", to: "Goa", departureDate: "2025-09-20", time: "05:00 AM - 01:00 PM", duration: "8h", price: 1300, type: "ac", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "KA08MN2345", from: "Bhubaneswar", to: "Pune", departureDate: "2025-09-20", time: "06:00 PM - 02:00 AM", duration: "8h", price: 1400, type: "sleeper", totalSeats: 40 },
{ operator: "Shivshakti Travels", busNumber: "KA09NO3456", from: "Bengaluru", to: "Hyderabad", departureDate: "2025-09-21", time: "07:00 AM - 03:00 PM", duration: "8h", price: 1300, type: "ac", totalSeats: 40 },
{ operator: "Neeta Travels", busNumber: "KA10OP4567", from: "Bhubaneswar", to: "Chennai", departureDate: "2025-09-21", time: "08:00 PM - 04:00 AM", duration: "8h", price: 1200, type: "sleeper", totalSeats: 40 },
{ operator: "KSRTC", busNumber: "KA11PQ5678", from: "Bengaluru", to: "Mysore", departureDate: "2025-09-22", time: "06:00 AM - 09:00 AM", duration: "3h", price: 500, type: "seater", totalSeats: 40 },
{ operator: "Orange Tours", busNumber: "KA12QR6789", from: "Mysore", to: "Bhubaneswar", departureDate: "2025-09-22", time: "10:00 AM - 01:00 PM", duration: "3h", price: 500, type: "ac", totalSeats: 40 },
{ operator: "Volvo Travels", busNumber: "KA13RS7890", from: "Bengaluru", to: "Mangalore", departureDate: "2025-09-23", time: "05:00 AM - 01:00 PM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "KA14ST8901", from: "Bhubaneswar", to: "Mysore", departureDate: "2025-09-23", time: "02:00 PM - 05:00 PM", duration: "3h", price: 500, type: "sleeper", totalSeats: 40 },
{ operator: "SRS Travels", busNumber: "KA15TU9012", from: "Bengaluru", to: "Goa", departureDate: "2025-09-24", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1400, type: "ac", totalSeats: 40 },
{ operator: "Shivshakti Travels", busNumber: "KA16UV0123", from: "Bhubaneswar", to: "Hyderabad", departureDate: "2025-09-24", time: "07:00 PM - 03:00 AM", duration: "8h", price: 1300, type: "sleeper", totalSeats: 40 },
{ operator: "Neeta Travels", busNumber: "KA17WX1234", from: "Bengaluru", to: "Pune", departureDate: "2025-09-25", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "KSRTC", busNumber: "KA18YZ2345", from: "Bhubaneswar", to: "Chennai", departureDate: "2025-09-25", time: "08:00 PM - 04:00 AM", duration: "8h", price: 1200, type: "sleeper", totalSeats: 40 },
{ operator: "Orange Tours", busNumber: "KA19AB3456", from: "Bengaluru", to: "Goa", departureDate: "2025-09-26", time: "05:00 AM - 01:00 PM", duration: "8h", price: 1400, type: "ac", totalSeats: 40 },
{ operator: "Volvo Travels", busNumber: "KA20BC4567", from: "Bhubaneswar", to: "Mangalore", departureDate: "2025-09-26", time: "02:00 PM - 10:00 PM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "KA21CD5678", from: "Bengaluru", to: "Hyderabad", departureDate: "2025-09-27", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1300, type: "sleeper", totalSeats: 40 },
{ operator: "SRS Travels", busNumber: "KA22DE6789", from: "Bhubaneswar", to: "Chennai", departureDate: "2025-09-27", time: "07:00 PM - 03:00 AM", duration: "8h", price: 1200, type: "ac", totalSeats: 40 },
{ operator: "Shivshakti Travels", busNumber: "KA23EF7890", from: "Bengaluru", to: "Pune", departureDate: "2025-09-28", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "Neeta Travels", busNumber: "KA24GH8901", from: "Bhubaneswar", to: "Mysore", departureDate: "2025-09-28", time: "03:00 PM - 06:00 PM", duration: "3h", price: 500, type: "seater", totalSeats: 40 },
{ operator: "KSRTC", busNumber: "KA25HI9012", from: "Mysore", to: "Bengaluru", departureDate: "2025-09-29", time: "06:00 AM - 09:00 AM", duration: "3h", price: 500, type: "ac", totalSeats: 40 },
{ operator: "Orange Tours", busNumber: "KA26IJ0123", from: "Bhubaneswar", to: "Goa", departureDate: "2025-09-29", time: "05:00 AM - 01:00 PM", duration: "8h", price: 1400, type: "ac", totalSeats: 40 },
{ operator: "Volvo Travels", busNumber: "KA27JK1234", from: "Bengaluru", to: "Hyderabad", departureDate: "2025-09-30", time: "06:00 PM - 02:00 AM", duration: "8h", price: 1300, type: "sleeper", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "KA28KL2345", from: "Bhubaneswar", to: "Chennai", departureDate: "2025-09-30", time: "07:00 AM - 03:00 PM", duration: "8h", price: 1200, type: "ac", totalSeats: 40 },
{ operator: "SRS Travels", busNumber: "KA29LM3456", from: "Bengaluru", to: "Pune", departureDate: "2025-10-01", time: "05:00 PM - 01:00 AM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "Shivshakti Travels", busNumber: "KA30MN4567", from: "Bhubaneswar", to: "Mysore", departureDate: "2025-10-01", time: "06:00 AM - 09:00 AM", duration: "3h", price: 500, type: "seater", totalSeats: 40 },
{ operator: "Neeta Travels", busNumber: "KA31NO5678", from: "Mysore", to: "Bengaluru", departureDate: "2025-10-02", time: "03:00 PM - 06:00 PM", duration: "3h", price: 500, type: "ac", totalSeats: 40 },
{ operator: "KSRTC", busNumber: "KA32OP6789", from: "Bengaluru", to: "Goa", departureDate: "2025-10-02", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1400, type: "ac", totalSeats: 40 },
{ operator: "Orange Tours", busNumber: "KA33PQ7890", from: "Bengaluru", to: "Hyderabad", departureDate: "2025-10-03", time: "07:00 PM - 03:00 AM", duration: "8h", price: 1300, type: "sleeper", totalSeats: 40 },
{ operator: "Volvo Travels", busNumber: "KA34QR8901", from: "Bhubaneswar", to: "Chennai", departureDate: "2025-10-03", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1200, type: "ac", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "KA35RS9012", from: "Bengaluru", to: "Pune", departureDate: "2025-10-04", time: "05:00 PM - 01:00 AM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "SRS Travels", busNumber: "KA36ST0123", from: "Bengaluru", to: "Mysore", departureDate: "2025-10-04", time: "06:00 AM - 09:00 AM", duration: "3h", price: 500, type: "seater", totalSeats: 40 },
{ operator: "Shivshakti Travels", busNumber: "KA37TU1234", from: "Mysore", to: "Bengaluru", departureDate: "2025-10-05", time: "03:00 PM - 06:00 PM", duration: "3h", price: 500, type: "ac", totalSeats: 40 },
{ operator: "Neeta Travels", busNumber: "KA38UV2345", from: "Bengaluru", to: "Goa", departureDate: "2025-10-05", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1400, type: "ac", totalSeats: 40 },
{ operator: "KSRTC", busNumber: "KA39WX3456", from: "Bengaluru", to: "Hyderabad", departureDate: "2025-10-06", time: "07:00 PM - 03:00 AM", duration: "8h", price: 1300, type: "sleeper", totalSeats: 40 },
{ operator: "Orange Tours", busNumber: "KA40XY4567", from: "Bengaluru", to: "Chennai", departureDate: "2025-10-06", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1200, type: "ac", totalSeats: 40 },
{ operator: "Volvo Travels", busNumber: "KA41YZ5678", from: "Bhubaneswar", to: "Pune", departureDate: "2025-10-07", time: "05:00 PM - 01:00 AM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "KA42AB6789", from: "Bengaluru", to: "Mysore", departureDate: "2025-10-07", time: "06:00 AM - 09:00 AM", duration: "3h", price: 500, type: "seater", totalSeats: 40 },
{ operator: "SRS Travels", busNumber: "KA43BC7890", from: "Mysore", to: "Bengaluru", departureDate: "2025-10-08", time: "03:00 PM - 06:00 PM", duration: "3h", price: 500, type: "ac", totalSeats: 40 },
{ operator: "Shivshakti Travels", busNumber: "KA44CD8901", from: "Kolkata", to: "Goa", departureDate: "2025-10-08", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1400, type: "ac", totalSeats: 40 },
{ operator: "Neeta Travels", busNumber: "KA45DE9012", from: "Bengaluru", to: "Hyderabad", departureDate: "2025-10-09", time: "07:00 PM - 03:00 AM", duration: "8h", price: 1300, type: "sleeper", totalSeats: 40 },
{ operator: "KSRTC", busNumber: "KA46EF0123", from: "Kolkata", to: "Chennai", departureDate: "2025-10-09", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1200, type: "ac", totalSeats: 40 },
{ operator: "Orange Tours", busNumber: "KA47FG1234", from: "Mumbai", to: "Pune", departureDate: "2025-10-10", time: "05:00 PM - 01:00 AM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "Volvo Travels", busNumber: "KA48GH2345", from: "Bhubaneswar", to: "Mysore", departureDate: "2025-10-10", time: "06:00 AM - 09:00 AM", duration: "3h", price: 500, type: "seater", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "KA49HI3456", from: "Mysore", to: "Bengaluru", departureDate: "2025-10-11", time: "03:00 PM - 06:00 PM", duration: "3h", price: 500, type: "ac", totalSeats: 40 },
{ operator: "SRS Travels", busNumber: "KA50IJ4567", from: "Bengaluru", to: "Goa", departureDate: "2025-10-11", time: "06:00 AM - 02:00 PM", duration: "8h", price:1400, type: "ac", totalSeats: 40 },
{ operator: "Shivshakti Travels", busNumber: "KA51JK5678", from: "Cuttack", to: "Hyderabad", departureDate: "2025-10-12", time: "07:00 PM - 03:00 AM", duration: "8h", price: 1300, type: "sleeper", totalSeats: 40 },
{ operator: "Neeta Travels", busNumber: "KA52KL6789", from: "Bhubaneswar", to: "Chennai", departureDate: "2025-10-12", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1200, type: "ac", totalSeats: 40 },
{ operator: "KSRTC", busNumber: "KA53LM7890", from: "Bengaluru", to: "Pune", departureDate: "2025-10-13", time: "05:00 PM - 01:00 AM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "Orange Tours", busNumber: "KA54MN8901", from: "Bengaluru", to: "Mysore", departureDate: "2025-10-13", time: "06:00 AM - 09:00 AM", duration: "3h", price: 500, type: "seater", totalSeats: 40 },
{ operator: "Volvo Travels", busNumber: "KA55NO9012", from: "Mysore", to: "Bengaluru", departureDate: "2025-10-14", time: "03:00 PM - 06:00 PM", duration: "3h", price: 500, type: "ac", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "KA56OP0123", from: "Delhi", to: "Goa", departureDate: "2025-10-14", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1400, type: "ac", totalSeats: 40 },
{ operator: "SRS Travels", busNumber: "KA57PQ1234", from: "Bhubaneswar", to: "Hyderabad", departureDate: "2025-10-15", time: "07:00 PM - 03:00 AM", duration: "8h", price: 1300, type: "sleeper", totalSeats: 40 },
{ operator: "Shivshakti Travels", busNumber: "KA58QR2345", from: "Cuttack", to: "Chennai", departureDate: "2025-10-15", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1200, type: "ac", totalSeats: 40 },
{ operator: "Neeta Travels", busNumber: "KA59RS3456", from: "Bhubaneswar", to: "Pune", departureDate: "2025-10-16", time: "05:00 PM - 01:00 AM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "KSRTC", busNumber: "KA60ST4567", from: "Bengaluru", to: "Mysore", departureDate: "2025-10-16", time: "06:00 AM - 09:00 AM", duration: "3h", price: 500, type: "seater", totalSeats: 40 },
{ operator: "Orange Tours", busNumber: "KA61TU5678", from: "Mysore", to: "Bengaluru", departureDate: "2025-10-17", time: "03:00 PM - 06:00 PM", duration: "3h", price: 500, type: "ac", totalSeats: 40 },
{ operator: "Volvo Travels", busNumber: "KA62UV6789", from: "Bengaluru", to: "Goa", departureDate: "2025-10-17", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1400, type: "ac", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "KA63WX7890", from: "Delhi", to: "Hyderabad", departureDate: "2025-10-18", time: "07:00 PM - 03:00 AM", duration: "8h", price: 1300, type: "sleeper", totalSeats: 40 },
{ operator: "SRS Travels", busNumber: "KA64XY8901", from: "Mumbai", to: "Chennai", departureDate: "2025-10-18", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1200, type: "ac", totalSeats: 40 },
{ operator: "Shivshakti Travels", busNumber: "KA65YZ9012", from: "Chennai", to: "Pune", departureDate: "2025-10-19", time: "05:00 PM - 01:00 AM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "Neeta Travels", busNumber: "KA66AB0123", from: "Vizag", to: "Mysore", departureDate: "2025-10-19", time: "06:00 AM - 09:00 AM", duration: "3h", price: 500, type: "seater", totalSeats: 40 },
{ operator: "KSRTC", busNumber: "KA67BC1234", from: "Mysore", to: "Bengaluru", departureDate: "2025-10-20", time: "03:00 PM - 06:00 PM", duration: "3h", price: 500, type: "ac", totalSeats: 40 },
{ operator: "Orange Tours", busNumber: "KA68CD2345", from: "Kolkata", to: "Goa", departureDate: "2025-10-20", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1400, type: "ac", totalSeats: 40 },
{ operator: "Volvo Travels", busNumber: "KA69DE3456", from: "Cuttack", to: "Hyderabad", departureDate: "2025-10-21", time: "07:00 PM - 03:00 AM", duration: "8h", price: 1300, type: "sleeper", totalSeats: 40 },
{ operator: "VRL Travels", busNumber: "KA70EF4567", from: "Cuttack", to: "Chennai", departureDate: "2025-10-21", time: "06:00 AM - 02:00 PM", duration: "8h", price: 1200, type: "ac", totalSeats: 40 },
{ operator: "SRS Travels", busNumber: "KA71FG5678", from: "Cuttack", to: "Pune", departureDate: "2025-10-22", time: "05:00 PM - 01:00 AM", duration: "8h", price: 1500, type: "ac", totalSeats: 40 },
{ operator: "Shivshakti Travels", busNumber: "KA72GH6789", from: "Bengaluru", to: "Mysore", departureDate: "2025-10-22", time: "06:00 AM - 09:00 AM", duration: "3h", price: 500, type: "seater", totalSeats: 40 },
{ operator: "Neeta Travels", busNumber: "KA73HI7890", from: "Mysore", to: "Bengaluru", departureDate: "2025-10-23", time: "03:00 PM - 06:00 PM", duration: "3h", price: 500, type: "ac", totalSeats:60}


];



// 🏨 Sample Hotels

const hotelData = [
{ hotelName: "The Grand Palace", city: "Bangalore", checkInDate: new Date("2025-10-01"), checkOutDate: new Date("2025-10-05"), rooms: 5, guests: 10, pricePerNight: 5000, amenities: ["WiFi","Pool","Gym","Spa"] },
{ hotelName: "Royal Residency", city: "Mumbai", checkInDate: new Date("2025-10-03"), checkOutDate: new Date("2025-10-07"), rooms: 3, guests: 6, pricePerNight: 4500, amenities: ["WiFi","Gym","Restaurant"] },
{ hotelName: "Sunrise Inn", city: "Delhi", checkInDate: new Date("2025-10-05"), checkOutDate: new Date("2025-10-09"), rooms: 4, guests: 8, pricePerNight: 3000, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Ocean View Resort", city: "Goa", checkInDate: new Date("2025-10-10"), checkOutDate: new Date("2025-10-15"), rooms: 6, guests: 12, pricePerNight: 6000, amenities: ["WiFi","Pool","Beach Access","Spa"] },
{ hotelName: "City Comforts", city: "Chennai", checkInDate: new Date("2025-10-02"), checkOutDate: new Date("2025-10-06"), rooms: 4, guests: 8, pricePerNight: 3500, amenities: ["WiFi","Gym"] },
{ hotelName: "Heritage Stay", city: "Kolkata", checkInDate: new Date("2025-10-04"), checkOutDate: new Date("2025-10-08"), rooms: 5, guests: 10, pricePerNight: 4000, amenities: ["WiFi","Breakfast","Restaurant"] },
{ hotelName: "Hilltop Retreat", city: "Manali", checkInDate: new Date("2025-10-06"), checkOutDate: new Date("2025-10-11"), rooms: 3, guests: 6, pricePerNight: 5500, amenities: ["WiFi","Pool","Spa"] },
{ hotelName: "Lakeside Hotel", city: "Udaipur", checkInDate: new Date("2025-10-08"), checkOutDate: new Date("2025-10-12"), rooms: 4, guests: 8, pricePerNight: 5000, amenities: ["WiFi","Gym","Pool"] },
{ hotelName: "Desert Inn", city: "Jaisalmer", checkInDate: new Date("2025-10-10"), checkOutDate: new Date("2025-10-14"), rooms: 3, guests: 6, pricePerNight: 4500, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Forest Lodge", city: "Coorg", checkInDate: new Date("2025-10-12"), checkOutDate: new Date("2025-10-17"), rooms: 5, guests: 10, pricePerNight: 6000, amenities: ["WiFi","Pool","Gym","Spa"] },
{ hotelName: "Metro Stay", city: "Pune", checkInDate: new Date("2025-10-14"), checkOutDate: new Date("2025-10-18"), rooms: 4, guests: 8, pricePerNight: 4000, amenities: ["WiFi","Gym","Breakfast"] },
{ hotelName: "Seaside Resort", city: "Kochi", checkInDate: new Date("2025-10-15"), checkOutDate: new Date("2025-10-20"), rooms: 5, guests: 10, pricePerNight: 5500, amenities: ["WiFi","Pool","Spa","Restaurant"] },
{ hotelName: "City Center Inn", city: "Lucknow", checkInDate: new Date("2025-10-16"), checkOutDate: new Date("2025-10-20"), rooms: 3, guests: 6, pricePerNight: 3500, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Royal Comforts", city: "Jaipur", checkInDate: new Date("2025-10-18"), checkOutDate: new Date("2025-10-22"), rooms: 4, guests: 8, pricePerNight: 4500, amenities: ["WiFi","Pool","Gym"] },
{ hotelName: "Mountain View Inn", city: "Shimla", checkInDate: new Date("2025-10-19"), checkOutDate: new Date("2025-10-24"), rooms: 5, guests: 10, pricePerNight: 5000, amenities: ["WiFi","Spa","Gym","Breakfast"] },
{ hotelName: "Luxe Stay", city: "Ahmedabad", checkInDate: new Date("2025-10-20"), checkOutDate: new Date("2025-10-24"), rooms: 4, guests: 8, pricePerNight: 4200, amenities: ["WiFi","Gym","Restaurant"] },
{ hotelName: "Heritage Resort", city: "Varanasi", checkInDate: new Date("2025-10-21"), checkOutDate: new Date("2025-10-25"), rooms: 3, guests: 6, pricePerNight: 3800, amenities: ["WiFi","Breakfast","Pool"] },
{ hotelName: "Blue Lagoon Hotel", city: "Goa", checkInDate: new Date("2025-10-22"), checkOutDate: new Date("2025-10-27"), rooms: 6, guests: 12, pricePerNight: 6000, amenities: ["WiFi","Pool","Spa","Beach Access"] },
{ hotelName: "City Lights Inn", city: "Bhubaneswar", checkInDate: new Date("2025-10-23"), checkOutDate: new Date("2025-10-27"), rooms: 4, guests: 8, pricePerNight: 3900, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Palace Retreat", city: "Mysore", checkInDate: new Date("2025-10-24"), checkOutDate: new Date("2025-10-28"), rooms: 5, guests: 10, pricePerNight: 5200, amenities: ["WiFi","Pool","Gym","Spa"] },
{ hotelName: "Metro Stay", city: "Pune", checkInDate: new Date("2025-10-14"), checkOutDate: new Date("2025-10-18"), rooms: 4, guests: 8, pricePerNight: 4000, amenities: ["WiFi","Gym","Breakfast"] },
{ hotelName: "Seaside Resort", city: "Kochi", checkInDate: new Date("2025-10-15"), checkOutDate: new Date("2025-10-20"), rooms: 5, guests: 10, pricePerNight: 5500, amenities: ["WiFi","Pool","Spa","Restaurant"] },
{ hotelName: "City Center Inn", city: "Lucknow", checkInDate: new Date("2025-10-16"), checkOutDate: new Date("2025-10-20"), rooms: 3, guests: 6, pricePerNight: 3500, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Royal Comforts", city: "Jaipur", checkInDate: new Date("2025-10-18"), checkOutDate: new Date("2025-10-22"), rooms: 4, guests: 8, pricePerNight: 4500, amenities: ["WiFi","Pool","Gym"] },
{ hotelName: "Mountain View Inn", city: "Shimla", checkInDate: new Date("2025-10-19"), checkOutDate: new Date("2025-10-24"), rooms: 5, guests: 10, pricePerNight: 5000, amenities: ["WiFi","Spa","Gym","Breakfast"] },
{ hotelName: "Luxe Stay", city: "Ahmedabad", checkInDate: new Date("2025-10-20"), checkOutDate: new Date("2025-10-24"), rooms: 4, guests: 8, pricePerNight: 4200, amenities: ["WiFi","Gym","Restaurant"] },
{ hotelName: "Heritage Resort", city: "Varanasi", checkInDate: new Date("2025-10-21"), checkOutDate: new Date("2025-10-25"), rooms: 3, guests: 6, pricePerNight: 3800, amenities: ["WiFi","Breakfast","Pool"] },
{ hotelName: "Blue Lagoon Hotel", city: "Goa", checkInDate: new Date("2025-10-22"), checkOutDate: new Date("2025-10-27"), rooms: 6, guests: 12, pricePerNight: 6000, amenities: ["WiFi","Pool","Spa","Beach Access"] },
{ hotelName: "City Lights Inn", city: "Bhubaneswar", checkInDate: new Date("2025-10-23"), checkOutDate: new Date("2025-10-27"), rooms: 4, guests: 8, pricePerNight: 3900, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Palace Retreat", city: "Mysore", checkInDate: new Date("2025-10-24"), checkOutDate: new Date("2025-10-28"), rooms: 5, guests: 10, pricePerNight: 5200, amenities: ["WiFi","Pool","Gym","Spa"] },
{ hotelName: "Lakeview Resort", city: "Nainital", checkInDate: new Date("2025-11-04"), checkOutDate: new Date("2025-11-08"), rooms: 4, guests: 8, pricePerNight: 4800, amenities: ["WiFi","Breakfast","Gym"] },
{ hotelName: "Royal Residency", city: "Hyderabad", checkInDate: new Date("2025-11-05"), checkOutDate: new Date("2025-11-09"), rooms: 5, guests: 10, pricePerNight: 6000, amenities: ["WiFi","Pool","Spa","Restaurant"] },
{ hotelName: "City Lodge", city: "Chennai", checkInDate: new Date("2025-11-06"), checkOutDate: new Date("2025-11-10"), rooms: 3, guests: 6, pricePerNight: 3500, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Beachside Hotel", city: "Kochi", checkInDate: new Date("2025-11-07"), checkOutDate: new Date("2025-11-12"), rooms: 6, guests: 12, pricePerNight: 7000, amenities: ["WiFi","Pool","Spa","Beach Access"] },
{ hotelName: "Grand Palace Inn", city: "Jaipur", checkInDate: new Date("2025-11-08"), checkOutDate: new Date("2025-11-13"), rooms: 4, guests: 8, pricePerNight: 4800, amenities: ["WiFi","Gym","Restaurant"] },
{ hotelName: "Hilltop Lodge", city: "Shimla", checkInDate: new Date("2025-11-09"), checkOutDate: new Date("2025-11-14"), rooms: 5, guests: 10, pricePerNight: 5500, amenities: ["WiFi","Pool","Gym","Breakfast"] },
{ hotelName: "Urban Stay", city: "Bengaluru", checkInDate: new Date("2025-11-10"), checkOutDate: new Date("2025-11-15"), rooms: 4, guests: 8, pricePerNight: 4000, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Seaside Retreat", city: "Goa", checkInDate: new Date("2025-11-11"), checkOutDate: new Date("2025-11-16"), rooms: 5, guests: 10, pricePerNight: 6500, amenities: ["WiFi","Pool","Spa","Beach Access"] },
{ hotelName: "Metro Comforts", city: "Mumbai", checkInDate: new Date("2025-11-12"), checkOutDate: new Date("2025-11-16"), rooms: 4, guests: 8, pricePerNight: 4200, amenities: ["WiFi","Gym","Breakfast"] },
{ hotelName: "Heritage Inn", city: "Lucknow", checkInDate: new Date("2025-11-13"), checkOutDate: new Date("2025-11-17"), rooms: 5, guests: 10, pricePerNight: 5200, amenities: ["WiFi","Pool","Spa","Gym"] },
{ hotelName: "Heritage Inn", city: "Lucknow", checkInDate: new Date("2025-10-11"), checkOutDate: new Date("2025-10-15"), rooms: 3, guests: 6, pricePerNight: 4200, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Blue Lagoon Resort", city: "Kochi", checkInDate: new Date("2025-10-12"), checkOutDate: new Date("2025-10-16"), rooms: 4, guests: 8, pricePerNight: 6800, amenities: ["WiFi","Pool","Beach Access"] },
{ hotelName: "Royal Orchid", city: "Bengaluru", checkInDate: new Date("2025-10-13"), checkOutDate: new Date("2025-10-17"), rooms: 2, guests: 4, pricePerNight: 5200, amenities: ["WiFi","Gym","Restaurant"] },
{ hotelName: "Lakeview Hotel", city: "Udaipur", checkInDate: new Date("2025-10-14"), checkOutDate: new Date("2025-10-18"), rooms: 3, guests: 6, pricePerNight: 6000, amenities: ["WiFi","Breakfast","Lake View"] },
{ hotelName: "Sunset Boulevard", city: "Goa", checkInDate: new Date("2025-10-15"), checkOutDate: new Date("2025-10-20"), rooms: 4, guests: 8, pricePerNight: 7200, amenities: ["WiFi","Pool","Beach Access","Breakfast"] },
{ hotelName: "Heritage Palace", city: "Jaipur", checkInDate: new Date("2025-10-16"), checkOutDate: new Date("2025-10-21"), rooms: 5, guests: 10, pricePerNight: 6500, amenities: ["WiFi","Gym","Restaurant","Breakfast"] },
{ hotelName: "City Comforts", city: "Delhi", checkInDate: new Date("2025-10-17"), checkOutDate: new Date("2025-10-22"), rooms: 2, guests: 4, pricePerNight: 4800, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Royal Residency", city: "Mumbai", checkInDate: new Date("2025-10-18"), checkOutDate: new Date("2025-10-23"), rooms: 3, guests: 6, pricePerNight: 5500, amenities: ["WiFi","Restaurant","Pool"] },
{ hotelName: "Ocean Breeze", city: "Goa", checkInDate: new Date("2025-10-19"), checkOutDate: new Date("2025-10-24"), rooms: 4, guests: 8, pricePerNight: 7000, amenities: ["WiFi","Pool","Beach Access","Breakfast"] },
{ hotelName: "Mountain View", city: "Manali", checkInDate: new Date("2025-10-20"), checkOutDate: new Date("2025-10-25"), rooms: 3, guests: 6, pricePerNight: 5800, amenities: ["WiFi","Gym","Breakfast"] },
{ hotelName: "Golden Tulip", city: "Bengaluru", checkInDate: new Date("2025-10-21"), checkOutDate: new Date("2025-10-26"), rooms: 2, guests: 4, pricePerNight: 5000, amenities: ["WiFi","Restaurant"] },
{ hotelName: "Silver Sands", city: "Pondicherry", checkInDate: new Date("2025-10-22"), checkOutDate: new Date("2025-10-27"), rooms: 3, guests: 6, pricePerNight: 6200, amenities: ["WiFi","Pool","Beach Access"] },
{ hotelName: "Royal Grand", city: "Hyderabad", checkInDate: new Date("2025-10-23"), checkOutDate: new Date("2025-10-28"), rooms: 4, guests: 8, pricePerNight: 6500, amenities: ["WiFi","Gym","Restaurant","Breakfast"] },
{ hotelName: "City Inn", city: "Chennai", checkInDate: new Date("2025-10-24"), checkOutDate: new Date("2025-10-29"), rooms: 2, guests: 4, pricePerNight: 4700, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Blue Horizon", city: "Kochi", checkInDate: new Date("2025-10-25"), checkOutDate: new Date("2025-10-30"), rooms: 3, guests: 6, pricePerNight: 6000, amenities: ["WiFi","Pool","Restaurant"] },
{ hotelName: "Grand View", city: "Shimla", checkInDate: new Date("2025-10-26"), checkOutDate: new Date("2025-10-31"), rooms: 3, guests: 6, pricePerNight: 5500, amenities: ["WiFi","Gym","Breakfast"] },
{ hotelName: "Ocean Pearl", city: "Goa", checkInDate: new Date("2025-10-27"), checkOutDate: new Date("2025-11-01"), rooms: 4, guests: 8, pricePerNight: 7200, amenities: ["WiFi","Pool","Beach Access","Breakfast"] },
{ hotelName: "Palace Stay", city: "Jaipur", checkInDate: new Date("2025-10-28"), checkOutDate: new Date("2025-11-02"), rooms: 5, guests: 10, pricePerNight: 6700, amenities: ["WiFi","Gym","Restaurant","Breakfast"] },
{ hotelName: "City Lights Inn", city: "Delhi", checkInDate: new Date("2025-10-29"), checkOutDate: new Date("2025-11-03"), rooms: 2, guests: 4, pricePerNight: 4800, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Royal Retreat", city: "Mumbai", checkInDate: new Date("2025-10-30"), checkOutDate: new Date("2025-11-04"), rooms: 3, guests: 6, pricePerNight: 5600, amenities: ["WiFi","Restaurant","Pool"] },
{ hotelName: "Sunset Bay", city: "Goa", checkInDate: new Date("2025-10-31"), checkOutDate: new Date("2025-11-05"), rooms: 4, guests: 8, pricePerNight: 7000, amenities: ["WiFi","Pool","Beach Access","Breakfast"] },
{ hotelName: "Mountain Lodge", city: "Manali", checkInDate: new Date("2025-11-01"), checkOutDate: new Date("2025-11-06"), rooms: 3, guests: 6, pricePerNight: 5800, amenities: ["WiFi","Gym","Breakfast"] },
{ hotelName: "Golden Gate", city: "Bengaluru", checkInDate: new Date("2025-11-02"), checkOutDate: new Date("2025-11-07"), rooms: 2, guests: 4, pricePerNight: 5000, amenities: ["WiFi","Restaurant"] },
{ hotelName: "Silver Beach Resort", city: "Pondicherry", checkInDate: new Date("2025-11-03"), checkOutDate: new Date("2025-11-08"), rooms: 3, guests: 6, pricePerNight: 6200, amenities: ["WiFi","Pool","Beach Access"] },
{ hotelName: "Royal Orchid Grand", city: "Hyderabad", checkInDate: new Date("2025-11-04"), checkOutDate: new Date("2025-11-09"), rooms: 4, guests: 8, pricePerNight: 6500, amenities: ["WiFi","Gym","Restaurant","Breakfast"] },
{ hotelName: "City Comfort Inn", city: "Chennai", checkInDate: new Date("2025-11-05"), checkOutDate: new Date("2025-11-10"), rooms: 2, guests: 4, pricePerNight: 4700, amenities: ["WiFi","Breakfast"] },
{ hotelName: "Blue Lagoon", city: "Kochi", checkInDate: new Date("2025-11-06"), checkOutDate: new Date("2025-11-11"), rooms: 3, guests: 6, pricePerNight: 6000, amenities: ["WiFi","Pool","Restaurant"] },
{ hotelName: "Grand Royal", city: "Shimla", checkInDate: new Date("2025-11-07"), checkOutDate: new Date("2025-11-12"), rooms: 3, guests: 6, pricePerNight: 5500, amenities: ["WiFi","Gym","Breakfast"] },
{ hotelName: "Ocean Breeze Resort", city: "Goa", checkInDate: new Date("2025-11-08"), checkOutDate: new Date("2025-11-13"), rooms: 4, guests: 8, pricePerNight: 7200, amenities: ["WiFi","Pool","Beach Access","Breakfast"] },
{ hotelName: "Palace Royale", city: "Jaipur", checkInDate: new Date("2025-11-09"), checkOutDate: new Date("2025-11-14"), rooms: 5, guests: 10, pricePerNight: 6700, amenities: ["WiFi","Gym","Restaurant","Breakfast"] }

];
// 💳 Sample Credit Cards
const creditcardData = [
  { cardnumber: "4133 2256 8755 5758", holdername: "Shubhendu Biswal", cardProvider: "HDFC", dueAmount: 15500, dueDate: "2025-06-25", status: "Unpaid" },
  { cardnumber: "5845 3545 2848 9087", holdername: "Subhasis Pradhan", cardProvider: "ICICI", dueAmount: 12000, dueDate: "2025-07-10", status: "Unpaid" },
  { cardnumber: "4744 8574 2438 0685", holdername: "Ram Prashad", cardProvider: "SBI", dueAmount: 8200, dueDate: "2025-06-30", status: "UnPaid" },
  { cardnumber: "6011 9574 6863 9673", holdername: "Gopal Krishna", cardProvider: "Axis", dueAmount: 4500, dueDate: "2025-07-05", status: "Unpaid" }
];

// 💡 Sample Electricity Bills
const electricitybillData = [
  { board: "BSES Delhi", consumerNumber: "123456789012", areaCode: "DEL123", consumerName: "Ramesh Kumar", billAmount: 1240, dueDate: "2025-06-25", lateFee: 50, status: "Unpaid" },
  { board: "TATA Power", consumerNumber: "987654321098", areaCode: "DEL456", consumerName: "Sita Sharma", billAmount: 980, dueDate: "2025-07-05", lateFee: 30, status: "Unpaid" },
  { board: "Adani", consumerNumber: "112233445566", areaCode: "DEL789", consumerName: "Rajesh Mehta", billAmount: 1750, dueDate: "2025-06-30", lateFee: 60, status: "Unpaid" },
  { board: "Torrent Power", consumerNumber: "556677889900", areaCode: "DEL321", consumerName: "Anita Singh", billAmount: 2200, dueDate: "2025-07-10", lateFee: 75, status: "Unpaid" },
  { board: "BESCOM", consumerNumber: "667788990011", areaCode: "BES123", consumerName: "Sunil Rao", billAmount: 1500, dueDate: "2025-07-15", lateFee: 50, status: "Unpaid" }
];

// 💧 Sample Water Bills
const waterbillData = [
  { board: "Delhi Jal Board", consumerNumber: "445566778899", areaCode: "DJB123", consumerName: "Amit Verma", billAmount: 720, dueDate: "2025-06-25", lateFee: 25, status: "Unpaid" },
  { board: "Bangalore Water Supply (BWSSB)", consumerNumber: "998877665544", areaCode: "BWSSB456", consumerName: "Kavita Nair", billAmount: 560, dueDate: "2025-07-05", lateFee: 20, status: "Unpaid" },
  { board: "Hyderabad Metro Water", consumerNumber: "223344556677", areaCode: "CMW789", consumerName: "Arun Kumar", billAmount: 850, dueDate: "2025-06-30", lateFee: 30, status: "Unpaid" },
  { board: "Chennai Metro Water", consumerNumber: "334455667788", areaCode: "HMWSS123", consumerName: "Priya Reddy", billAmount: 640, dueDate: "2025-07-10", lateFee: 25, status: "Unpaid" },
  { board: "Delhi Jal Board", consumerNumber: "112244668899", areaCode: "MJB456", consumerName: "Rohit Sharma", billAmount: 930, dueDate: "2025-07-15", lateFee: 35, status: "Unpaid" }
];

// 🔥 Sample Gas Bills
const gasbillData = [
  { provider: "Indane Gas", consumerNumber: "8745373953945", areaCode: "DEL100", consumerName: "Ravi Sharma", billAmount: 850, dueDate: "2025-06-28", lateFee: 20, status: "Unpaid" },
  { provider: "HP Gas", consumerNumber: "2452346346570", areaCode: "DEL200", consumerName: "Neha Gupta", billAmount: 920, dueDate: "2025-07-03", lateFee: 25, status: "Unpaid" },
  { provider: "Bharat Gas", consumerNumber: "5975878578357", areaCode: "DEL300", consumerName: "Amit Verma", billAmount: 780, dueDate: "2025-07-08", lateFee: 15, status: "Unpaid" },
  { provider: "GAIL", consumerNumber: "9345654665868", areaCode: "DEL400", consumerName: "Pooja Singh", billAmount: 1050, dueDate: "2025-07-12", lateFee: 30, status: "Unpaid" },
  { provider: "Bharat Gas", consumerNumber: "3327583585746", areaCode: "GJ500", consumerName: "Suresh Patel", billAmount: 670, dueDate: "2025-07-15", lateFee: 10, status: "Unpaid" }
];

// 📱 Sample Mobile Recharges
const mobilerechargeData = [
  { mobileNumber: "9123456789", operator: "Airtel", circle: "Delhi NCR", amount: 299, status: "" },
  { mobileNumber: "9876543210", operator: "Jio", circle: "Odisha", amount: 199, status: "" },
  { mobileNumber: "9812345678", operator: "VI", circle: "Maharashtra", amount: 249, status: "" },
  { mobileNumber: "7001234567", operator: "BSNL", circle: "Tamil Nadu", amount: 149, status: ""},
  { mobileNumber: "8899776655", operator: "Airtel", circle: "Karnataka", amount: 399, status: "" },
  { mobileNumber: "9090909090", operator: "Jio", circle: "West Bengal", amount: 555, status: "" },
  { mobileNumber: "8665332211", operator: "VI", circle: "Kerala", amount: 219, status: "" },
  { mobileNumber: "9334455667", operator: "BSNL", circle: "Punjab", amount: 109, status: "" },
  { mobileNumber: "7778889990", operator: "Airtel", circle: "Gujarat", amount: 499, status: ""},
  { mobileNumber: "9556677889", operator: "Jio", circle: "Rajasthan", amount: 179, status: "" }
];

// 📺 Sample DTH Recharges
const dthrechargeData = [
  { operator: "Dish TV", customerId: "100001", amount: 199, status: "" },
  { operator: "Tata Play", customerId: "100002", amount: 299, status: "" },
  { operator: "Airtel DTH", customerId: "100003", amount: 399, status: "" },
  { operator: "Sun Direct", customerId: "100004", amount: 249, status: "" },
  { operator: "Dish TV", customerId: "100005", amount: 499, status: "" },
  { operator: "Tata Play", customerId: "100006", amount: 199, status: "" },
  { operator: "Airtel DTH", customerId: "100007", amount: 299, status: "" },
  { operator: "Sun Direct", customerId: "100008", amount: 399, status: "" },
  { operator: "Dish TV", customerId: "100009", amount: 249, status: "" },
  { operator: "Tata Play", customerId: "100010", amount: 499, status: "" },
  { operator: "Airtel DTH", customerId: "100011", amount: 199, status: "" },
  { operator: "Sun Direct", customerId: "100012", amount: 299, status: "" },
  { operator: "Dish TV", customerId: "100013", amount: 399, status: "" },
  { operator: "Tata Play", customerId: "100014", amount: 249, status: "" },
  { operator: "Airtel DTH", customerId: "100015", amount: 499, status: "" }
];

// 🚗 Sample Fastag Data
const fastagData = [
  { vehicleNumber: "OD02AB1234", provider: "HDFC FASTag", customerId: "CUST1001", amount: 500, status: "Success", date: new Date() },
  { vehicleNumber: "OD05XY5678", provider: "ICICI FASTag", customerId: "CUST1002", amount: 1000, status: "Success", date: new Date() },
  { vehicleNumber: "OD21MN4321", provider: "SBI FASTag", customerId: "CUST1003", amount: 300, status: "Success", date: new Date() },
  { vehicleNumber: "OD11PQ8765", provider: "Axis Bank FASTag", customerId: "CUST1004", amount: 750, status: "Success", date: new Date() },
  { vehicleNumber: "OD33KL9999", provider: "Paytm FASTag", customerId: "CUST1005", amount: 1200, status: "Success", date: new Date() }
];

// 💰 Sample Loan Data
const loanData = [
  { loanProvider: "HDFC Bank", accountNumber: "87324678438", customerName: "Rahul Sharma", emiAmount: 7500, dueDate: new Date("2025-10-15"), status: "Unpaid" },
  { loanProvider: "ICICI Bank", accountNumber: "43253373836", customerName: "Priya Mehta", emiAmount: 12000, dueDate: new Date("2025-10-20"), status: "Unpaid" },
  { loanProvider: "SBI Bank", accountNumber: "65764764389", customerName: "Amit Verma", emiAmount: 5000, dueDate: new Date("2025-10-25"), status: "Unpaid" },
  { loanProvider: "Axis Bank", accountNumber: "16761254651", customerName: "Neha Singh", emiAmount: 9500, dueDate: new Date("2025-10-30"), status: "Unpaid" },
  { loanProvider: "Kotak Mahindra Bank", accountNumber: "27389793480", customerName: "Rohit Kumar", emiAmount: 8800, dueDate: new Date("2025-11-05"), status: "Unpaid" },
  { loanProvider: "Bajaj Finance", accountNumber: "99653367223", customerName: "Simran Kaur", emiAmount: 6400, dueDate: new Date("2025-11-10"), status: "Unpaid" },
  { loanProvider: "SBI Bank", accountNumber: "87821648782", customerName: "Vikram Singh", emiAmount: 10200, dueDate: new Date("2025-11-15"), status: "Unpaid" },
  { loanProvider: "HDFC Bank", accountNumber: "57328636327", customerName: "Anjali Mehta", emiAmount: 7200, dueDate: new Date("2025-11-20"), status: "Unpaid" }
];

// 🏦 Sample Bank Accounts
const bankaccountData = [
   { accountNumber: "100000000001", ifscCode: "SBIN0000001", balance: 100000, transactions: [] },
  { accountNumber: "100000000002", ifscCode: "SBIN0000002", balance: 90000, transactions: [] },
  { accountNumber: "100000000003", ifscCode: "SBIN0000003", balance: 80000, transactions: [] },
  { accountNumber: "100000000004", ifscCode: "SBIN0000004", balance: 70000, transactions: [] },
  { accountNumber: "100000000005", ifscCode: "SBIN0000005", balance: 60000, transactions: [] },
  { accountNumber: "100000000006", ifscCode: "SBIN0000006", balance: 50000, transactions: [] },
  { accountNumber: "100000000007", ifscCode: "SBIN0000007", balance: 40000, transactions: [] },
  { accountNumber: "100000000008", ifscCode: "SBIN0000008", balance: 30000, transactions: [] },
  { accountNumber: "100000000009", ifscCode: "SBIN0000009", balance: 20000, transactions: [] },
  { accountNumber: "100000000010", ifscCode: "SBIN0000010", balance: 10000, transactions: [] }
];

// Sample Check Balance
const checkbalanceData = [
  { bankname: "SBI - State Bank of India", accountnumber: "100001", pin: "2005", balance: 45200.00 },
  { bankname: "Axis Bank", accountnumber: "100002", pin: "2005", balance: 1200000340.50 },
  { bankname: "HDFC Bank", accountnumber: "100003", pin: "2005", balance: 88000.00 },
  { bankname: "ICICI Bank", accountnumber: "100004", pin: "2005", balance: 76530.75 },
  { bankname: "Bank of Baroda", accountnumber: "100005", pin: "2005", balance: 15000.00 },
  { bankname: "Kotak Mahindra Bank", accountnumber: "100006", pin: "2005", balance: 32400.00 },
  { bankname: "JP Morgan", accountnumber: "100007", pin: "2005", balance: 200000000.00 }
];

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

async function seedData() {
  try {
    // Clear old data
    await Flight.deleteMany();
    await Train.deleteMany();
    await Bus.deleteMany();
    await Hotel.deleteMany();
    await CreditCard.deleteMany();
    await electricitybill.deleteMany();
    await waterbill.deleteMany();
    await gasbill.deleteMany();
    await mobilerecharge.deleteMany();
    await dthrecharge.deleteMany();
    await fastag.deleteMany();
    await loan.deleteMany();
    await bankaccount.deleteMany();
    await checkbalance.deleteMany();
    
    // Insert new data
    const flights = await Flight.insertMany(flightData);
    const trains = await Train.insertMany(trainData);
    const buses = await Bus.insertMany(busData);
    const hotels = await Hotel.insertMany(hotelData);
    const creditcards = await CreditCard.insertMany(creditcardData); 
    const electricitybills= await electricitybill.insertMany(electricitybillData);
    const waterbills= await waterbill.insertMany(waterbillData);
    const gasbills= await gasbill.insertMany(gasbillData);
    const mobilerecharges= await mobilerecharge.insertMany(mobilerechargeData);
    const dthrecharges= await dthrecharge.insertMany(dthrechargeData);
    const fastags= await fastag.insertMany(fastagData);
    const loans= await loan.insertMany(loanData);
    const bankaccounts= await bankaccount.insertMany(bankaccountData);
    const checkbalances= await checkbalance.insertMany(checkbalanceData);
    

    // Logs
    console.log(`✈️  Flights seeded: ${flights.length}`);
    console.log(`🚆 Trains seeded: ${trains.length}`);
    console.log(`🚌 Buses seeded: ${buses.length}`);
    console.log(`🏨 Hotels seeded: ${hotels.length}`);
    console.log(`💳 Credit Cards seeded: ${creditcards.length}`);
    console.log(`💡 Electricity Bills seeded: ${electricitybills.length}`);
    console.log(`💧 Water Bills seeded: ${waterbills.length}`);
    console.log(`🔥 Gas Bills seeded: ${gasbills.length}`);
    console.log(`📱 Mobile Recharges seeded: ${mobilerecharges.length}`);
    console.log(`Dth Recharge seeded : ${dthrecharges.length}`);
    console.log(`Fastag seeded : ${fastags.length}`);
    console.log(`loan seeded : ${loans.length}`);
    console.log(`Bank Account seeded : ${bankaccounts.length}`);
    console.log(`Check Balance seeded : ${checkbalances.length}`);
    console.log("✅ Database seeded successfully!");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
}

seedData();


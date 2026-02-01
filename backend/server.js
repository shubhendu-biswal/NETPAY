const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ------------------------
// Middleware
// ------------------------
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cors());
app.use(morgan("dev"));

// ------------------------
// Routes
// ------------------------
const authRoutes = require("./routes/authRoutes.js");
const bookingRoutes = require("./routes/booking.js");
const searchRoutes = require("./routes/search.js");
const flightRoutes = require("./routes/flights.js");
const trainRoutes = require("./routes/trains.js");
const busRoutes = require("./routes/buses.js");
const hotelRoutes = require("./routes/hotels.js");
const creditcardRoutes = require("./routes/creditcards.js");
const paymentRoutes = require('./routes/payments');
const electricitybillRoutes = require('./routes/electricitybills');
const waterbillRoutes = require('./routes/waterbills');
const gasbillRoutes = require('./routes/gasbills');
const mobilerechargeRoutes = require('./routes/mobilerecharges');
const dthrechargeRoutes = require('./routes/dthrecharges');
const fastagRoutes = require("./routes/fastags");
const loanRoutes = require("./routes/loans");
const bankaccountRoutes = require("./routes/bankaccounts");
const checkbalanceRoutes = require("./routes/checkbalances");


app.use("/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/creditcards", creditcardRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/electricitybills", electricitybillRoutes);
app.use("/api/waterbills", waterbillRoutes);
app.use("/api/gasbills", gasbillRoutes);
app.use("/api/mobilerecharges", mobilerechargeRoutes);
app.use("/api/dthrecharges", dthrechargeRoutes);
app.use("/api/fastags", fastagRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/bankaccounts", bankaccountRoutes);
app.use("/api/checkbalances", checkbalanceRoutes);


// ------------------------
// Test Route
// ------------------------
app.get("/", (req, res) => {
  res.send("🚀 flight backend Running...");
});

// ------------------------
// Start Server
// ------------------------
const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// ------------------------
// Handle Server Errors
// ------------------------
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Please stop the other process or change the port in .env`);
    process.exit(1);
  } else {
    console.error("❌ Server Error:", err);
  }
});
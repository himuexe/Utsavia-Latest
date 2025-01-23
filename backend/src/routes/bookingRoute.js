const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifytoken");
const BookingController = require("../controllers/BookingController");

// Create a new booking
router.post("/", verifyToken, BookingController.createBooking);

// Get all bookings for a user
router.get("/user", verifyToken, BookingController.getUserBookings);

// Get a single booking by ID
router.get("/:id", verifyToken, BookingController.getBookingById);

// Update booking status (e.g., mark as paid or cancelled)
router.put("/:id/status", verifyToken, BookingController.updateBookingStatus);

module.exports = router;
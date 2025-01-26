const Booking = require("../models/booking");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { items, totalAmount, paymentIntentId, address } = req.body;
    const userId = req.userId;

    // Validate the address object
    if (!address || !address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      return res.status(400).json({ error: "Address is incomplete. Please provide all required fields." });
    }

    const newBooking = new Booking({
      userId,
      items,
      totalAmount,
      paymentIntentId,
      address: { // Ensure the address object is properly structured
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        isPrimary: address.isPrimary || false, // Optional field
      },
      status: "paid", // Set status to "paid" after successful payment
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};
// Get all bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
};
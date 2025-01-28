const CateringBooking = require("../models/catering");

// Create a new catering booking
const createBooking = async (req, res) => {
  try {
    const { eventDetails, menuItems, totalAmount, paymentIntentId, address } = req.body;
    const userId = req.userId;

    // Validate the address object
    if (!address || !address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      return res.status(400).json({ error: "Address is incomplete. Please provide all required fields." });
    }

    // Validate event details
    if (!eventDetails || !eventDetails.date || !eventDetails.timeSlot || !eventDetails.guestCount || !eventDetails.eventType) {
      return res.status(400).json({ error: "Event details are incomplete. Please provide all required fields." });
    }

    // Validate menu items
    if (!menuItems || menuItems.length === 0) {
      return res.status(400).json({ error: "Please select at least one menu item." });
    }

    const newBooking = new CateringBooking({
      userId,
      eventDetails,
      menuItems,
      totalAmount,
      paymentIntentId,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        isPrimary: address.isPrimary || false,
      },
      status: "paid", // Set status to "paid" after successful payment
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating catering booking:", error);
    res.status(500).json({ error: "Failed to create catering booking" });
  }
};

// Get all catering bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await CateringBooking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching catering bookings:", error);
    res.status(500).json({ error: "Failed to fetch catering bookings" });
  }
};

// Get a single catering booking by ID
const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await CateringBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Catering booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching catering booking:", error);
    res.status(500).json({ error: "Failed to fetch catering booking" });
  }
};

// Update catering booking status
const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    const booking = await CateringBooking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Catering booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating catering booking status:", error);
    res.status(500).json({ error: "Failed to update catering booking status" });
  }
};

// Get all catering bookings (admin route)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await CateringBooking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching all catering bookings:", error);
    res.status(500).json({ error: "Failed to fetch all catering bookings" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};
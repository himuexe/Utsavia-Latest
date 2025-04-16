const Booking = require("../models/booking");
const Vendor = require("../models/vendor");
const Item = require("../models/item");
// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { items, totalAmount, paymentIntentId, address } = req.body;
    const userId = req.userId;

    // Validate the address object
    if (!address || !address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      return res.status(400).json({ error: "Address is incomplete. Please provide all required fields." });
    }

    // Validate items array
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Items are required for booking." });
    }

    // Check for duplicate items with same date and time
    const itemDateTimeMap = {};
    for (const item of items) {
      if (!item.itemId || !item.date || !item.timeSlot) {
        return res.status(400).json({ error: "Item information is incomplete." });
      }
      
      const key = `${item.itemId}-${item.date}-${item.timeSlot}`;
      if (itemDateTimeMap[key]) {
        return res.status(400).json({ error: "Duplicate booking for the same item, date, and time slot." });
      }
      itemDateTimeMap[key] = true;
    }

    // Get all unique item IDs from the request
    const itemIds = items.map(item => item.itemId);
    
    // Find all items with their vendors
    const foundItems = await Item.find({ _id: { $in: itemIds } }).populate('vendor');
    if (foundItems.length !== new Set(itemIds).size) {
      return res.status(404).json({ error: "Some items not found." });
    }

    // Create a mapping of itemId to vendor for quick lookup
    const itemVendorMap = {};
    foundItems.forEach(item => {
      itemVendorMap[item._id.toString()] = item.vendor?._id || null;
    });

    // Prepare the items array with vendor information
    const bookingItems = items.map(item => {
      const foundItem = foundItems.find(i => i._id.toString() === item.itemId);
      return {
        itemId: item.itemId,
        itemName: foundItem.name, // Get name from database rather than request
        price: item.price,
        date: item.date,
        timeSlot: item.timeSlot,
        vendorId: itemVendorMap[item.itemId]
      };
    });

    const newBooking = new Booking({
      userId,
      items: bookingItems,
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
      status: "pending", 
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

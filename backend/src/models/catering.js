const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['starters', 'mainCourse', 'desserts', 'drinks'],
    required: true 
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const cateringBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventDetails: {
      date: { type: Date, required: true },
      timeSlot: { type: String, required: true },
      guestCount: { type: Number, required: true },
      eventType: { 
        type: String, 
        enum: ['wedding', 'corporate', 'birthday', 'other'],
        required: true 
      }
    },
    menuItems: [menuItemSchema],
    serviceRequirements: {
      needsServers: { type: Boolean, default: false },
      needsSetup: { type: Boolean, default: false },
      needsCleanup: { type: Boolean, default: false },
      specialInstructions: { type: String }
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "paid", "cancelled"],
      default: "pending",
    },
    paymentIntentId: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      isPrimary: { type: Boolean, default: false },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CateringBooking", cateringBookingSchema);
const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      items: [
        {
          itemName: { type: String, required: true },
          price: { type: Number, required: true },
          date: { type: Date, required: true },
          timeSlot: { type: String, required: true },
        },
      ],
      totalAmount: { type: Number, required: true },
      status: {
        type: String,
        enum: ["pending", "paid", "cancelled"],
        default: "pending",
      },
      paymentIntentId: { type: String }, 
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Booking", bookingSchema);
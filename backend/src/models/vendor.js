const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the bank details schema
const BankDetailsSchema = new Schema({
  accountNumber: {
    type: String,
    required: function() {
      return this.parent().paymentMode === 'bank';
    }
  },
  ifscCode: {
    type: String,
    trim: true,
    required: function() {
      return this.parent().paymentMode === 'bank';
    }
  },
  accountHolderName: {
    type: String,
    trim: true,
    required: function() {
      return this.parent().paymentMode === 'bank';
    }
  }
});

// Define the vendor schema
const VendorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, match: [/^\d{10}$/, 'Please enter a valid phone number'] },
    address: { type: String },
    companyName: { type: String, trim: true },
    paymentMode: { type: String, enum: ['upi', 'bank'], default: 'upi' },
    upiId: { type: String, trim: true },
    bankDetails: { type: BankDetailsSchema, default: {} },
    location: { type: String },
    city: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { collection: 'vendors', timestamps: true }
);

// Create and export the model
const Vendor = mongoose.model('vendors', VendorSchema);

module.exports = {
  Vendor,
  BankDetailsSchema
};
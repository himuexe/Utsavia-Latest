const mongoose = require("mongoose");

const authMethodSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ['local', 'google']
  },
  providerId: { 
    type: String,
    required: function() {
      return this.provider !== 'local';
    }
  },
  email: {
    type: String,
    required: true
  },
  password: { 
    type: String,
    required: function() {
      return this.provider === 'local';
    }
  }
}, { _id: false });


const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isPrimary: { type: Boolean, default: false } 
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: false 
  },
  lastName: { 
    type: String, 
    required: false 
  },
  primaryEmail: { 
    type: String, 
    required: true ,
    unique: true
  },
  addresses: [addressSchema], // Array of addresses
  phone: { 
    type: String, 
    default: '' 
  },
  authMethods: [authMethodSchema]
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
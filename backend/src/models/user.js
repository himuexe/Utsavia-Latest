const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const authMethodSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ['local', 'google']
  },
  providerId: { 
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: { 
    type: String,
    required: false
  }
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
    required: true 
  },
  address: { 
    type: String, 
    default: '' 
  },
  phone: { 
    type: String, 
    default: '' 
  },
  authMethods: [authMethodSchema]
}, {
  timestamps: true
});

userSchema.index({ 'authMethods.provider': 1, 'authMethods.email': 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
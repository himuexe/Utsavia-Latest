const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userMessage: {
    type: String,
    required: true
  },
  botResponse: {
    type: String,
    required: true
  },
  intent: {
    type: String,
    enum: ['booking', 'payment', 'contact', 'cancel', 'cities', 'login', 'register', 'themes', 'general'],
    default: 'general'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  feedback: {
    type: Number,
    enum: [0, 1], 
    default: null
  }
});

// Index for faster queries
ChatMessageSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
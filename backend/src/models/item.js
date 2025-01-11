const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  prices: [{
    city: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  image: {
    type: String, 
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


itemSchema.index({ category: 1 });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
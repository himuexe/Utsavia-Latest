const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true  // Keep this one, remove the explicit index
  },
  description: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    required: true,
    default: 0
  },
  path: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String, 
    required: false
  }
}, {
  timestamps: true
});

// Remove the slug index since it's already defined in the schema
categorySchema.index({ parentId: 1 });
categorySchema.index({ path: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
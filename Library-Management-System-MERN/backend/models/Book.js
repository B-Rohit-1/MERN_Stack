const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true
  },
  publishedYear: {
    type: Number,
    required: [true, 'Please add the published year']
  },
  publisher: {
    type: String,
    required: [true, 'Please add a publisher']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add the quantity'],
    min: [0, 'Quantity cannot be negative']
  },
  available: {
    type: Number,
    required: [true, 'Please add available quantity'],
    min: [0, 'Available quantity cannot be negative']
  },
  shelfLocation: {
    type: String,
    required: [true, 'Please add shelf location']
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', bookSchema);

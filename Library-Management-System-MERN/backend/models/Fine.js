const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  bookIssue: {
    type: mongoose.Schema.ObjectId,
    ref: 'BookIssue',
    required: [true, 'Please select a book issue']
  },
  member: {
    type: mongoose.Schema.ObjectId,
    ref: 'Member',
    required: [true, 'Please select a member']
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: [true, 'Please select a book']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative']
  },
  issueDate: {
    type: Date,
    required: [true, 'Please add issue date']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add due date']
  },
  returnDate: {
    type: Date
  },
  daysOverdue: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'waived', 'cancelled'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online', 'waived', 'other'],
    default: 'cash'
  },
  collectedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

fineSchema.pre('save', function(next) {
  if (this.isNew && this.returnDate && this.dueDate) {
    const diffTime = Math.abs(this.returnDate - this.dueDate);
    this.daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  if (this.isModified('status') && this.status === 'paid' && !this.paymentDate) {
    this.paymentDate = Date.now();
  }
  
  next();
});

module.exports = mongoose.model('Fine', fineSchema);

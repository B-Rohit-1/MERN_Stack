const mongoose = require('mongoose');

const bookIssueSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: [true, 'Please select a book']
  },
  member: {
    type: mongoose.Schema.ObjectId,
    ref: 'Member',
    required: [true, 'Please select a member']
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['issued', 'returned', 'overdue', 'lost'],
    default: 'issued'
  },
  fineAmount: {
    type: Number,
    default: 0
  },
  fineStatus: {
    type: String,
    enum: ['none', 'pending', 'paid'],
    default: 'none'
  },
  issuedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  receivedBy: {
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

bookIssueSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Book = mongoose.model('Book');
    await Book.findByIdAndUpdate(this.book, { $inc: { available: -1 } });
    
    const Member = mongoose.model('Member');
    await Member.findByIdAndUpdate(this.member, { $inc: { totalBooksCheckedOut: 1 } });
  }
  
  if (this.isModified('status') && this.status === 'returned' && !this.returnDate) {
    this.returnDate = Date.now();
    
    if (this.returnDate > this.dueDate) {
      const daysOverdue = Math.ceil((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
      this.fineAmount = daysOverdue * 10; 
      this.fineStatus = this.fineAmount > 0 ? 'pending' : 'none';
    }
    
    const Book = mongoose.model('Book');
    await Book.findByIdAndUpdate(this.book, { $inc: { available: 1 } });
    
    const Member = mongoose.model('Member');
    await Member.findByIdAndUpdate(this.member, { $inc: { totalBooksCheckedOut: -1 } });
  }
  
  next();
});

module.exports = mongoose.model('BookIssue', bookIssueSchema);

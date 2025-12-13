const BookIssue = require('../models/BookIssue');
const Fine = require('../models/Fine');
const Book = require('../models/Book');
const Member = require('../models/Member');

exports.getMemberDashboard = async (req, res) => {
  try {
    const memberId = req.user.id;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const issuedBooks = await BookIssue.find({ member: memberId, returnDate: null })
      .populate('book', 'title author isbn')
      .select('issueDate dueDate');

    const fines = await Fine.find({ member: memberId, status: 'unpaid' })
      .select('amount reason status createdAt');

    const availableBooks = await Book.find({ 
      _id: { $nin: issuedBooks.map(ib => ib.book?._id).filter(Boolean) } 
    }).select('title author isbn availableCopies');

    res.json({
      member: {
        name: member.name,
        email: member.email,
        membershipId: member.membershipId
      },
      issuedBooks: issuedBooks || [],
      fines: fines || [],
      availableBooks: availableBooks || []
    });

  } catch (error) {
    console.error('Error getting member dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

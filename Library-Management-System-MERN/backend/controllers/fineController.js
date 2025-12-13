const Fine = require('../models/Fine');
const BookIssue = require('../models/BookIssue');

exports.getFines = async (req, res) => {
  try {
    const { status, memberId, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (memberId) {
      query.member = memberId;
    }

    const fines = await Fine.find(query)
      .populate('member', 'name email')
      .populate('book', 'title')
      .populate('collectedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Fine.countDocuments(query);

    res.json({
      fines,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.payFine = async (req, res) => {
  try {
    const { fineId } = req.params;
    const { amount, paymentMethod, notes } = req.body;

    const fine = await Fine.findById(fineId)
      .populate('member', 'name email')
      .populate('book', 'title');

    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    if (fine.status === 'paid') {
      return res.status(400).json({ message: 'Fine already paid' });
    }

    fine.amountPaid = amount || fine.amount;
    fine.paymentMethod = paymentMethod || fine.paymentMethod;
    fine.paymentDate = new Date();
    fine.status = 'paid';
    fine.collectedBy = req.user.id;
    fine.notes = notes || fine.notes;

    await fine.save();

    // Update related book issue if exists
    if (fine.bookIssue) {
      const bookIssue = await BookIssue.findById(fine.bookIssue);
      if (bookIssue) {
        bookIssue.fineStatus = 'paid';
        await bookIssue.save();
      }
    }

    res.json(fine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.waiveFine = async (req, res) => {
  try {
    const { fineId } = req.params;
    const { reason } = req.body;

    const fine = await Fine.findById(fineId);
    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    fine.status = 'waived';
    fine.notes = reason ? `Waived: ${reason}` : 'Fine waived by admin';
    fine.collectedBy = req.user.id;
    fine.paymentDate = new Date();

    await fine.save();

    // Update related book issue if exists
    if (fine.bookIssue) {
      const bookIssue = await BookIssue.findById(fine.bookIssue);
      if (bookIssue) {
        bookIssue.fineStatus = 'waived';
        await bookIssue.save();
      }
    }

    res.json(fine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMemberFines = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status } = req.query;

    const query = { member: memberId };
    if (status) {
      query.status = status;
    }

    const fines = await Fine.find(query)
      .populate('book', 'title')
      .populate('collectedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
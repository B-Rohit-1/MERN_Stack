const Member = require('../models/Member');

exports.getMembers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search 
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
          ]
        } 
      : {};

    const members = await Member.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Member.countDocuments(query);

    res.json({
      members,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createMember = async (req, res) => {
  try {
    const member = new Member({
      ...req.body,
      addedBy: req.user.id
    });
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    Object.keys(req.body).forEach(key => {
      member[key] = req.body[key];
    });

    await member.save();
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (member.totalBooksCheckedOut > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete member with checked out books' 
      });
    }

    await member.remove();
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};